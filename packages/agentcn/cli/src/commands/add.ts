import { Command } from "commander";
import { existsSync } from "node:fs";
import path from "node:path";
import { mergeEnvExample, updateTsconfigPaths } from "../lib/config.js";
import { installDependencies } from "../lib/deps.js";
import { applyInstallPlan, planInstall } from "../lib/install-plan.js";
import {
  loadRegistryItem,
  parseAddOptions,
  resolveRegistrySource,
} from "../lib/registry.js";
import type { AddOptionsInput } from "../types.js";
import { logger } from "../utils/logger.js";
import { confirmAction } from "../utils/prompt.js";
import { spinner } from "../utils/spinner.js";

type ConfirmFn = (message: string, defaultValue?: boolean) => Promise<boolean>;

type AddRuntimeHooks = {
  confirm?: ConfirmFn;
};

const AGENT_ALIASES: Record<string, string> = {
  fileagent: "file-agent",
  file_agent: "file-agent",
  webagent: "web-agent",
  web_agent: "web-agent",
};

function normalizeAgentName(input: string): { value: string; aliased: boolean } {
  const trimmed = input.trim();
  const alias = AGENT_ALIASES[trimmed.toLowerCase()];
  if (alias) return { value: alias, aliased: true };

  const normalized = trimmed.replace(/_/g, "-").toLowerCase();
  if (normalized !== trimmed) {
    return { value: normalized, aliased: true };
  }

  return { value: trimmed, aliased: false };
}

function printSection(title: string): void {
  logger.break();
  logger.info(title);
}

export async function runAddCommand(
  agentName: string,
  input: AddOptionsInput,
  hooks: AddRuntimeHooks = {}
): Promise<void> {
  const confirm = hooks.confirm ?? confirmAction;
  const parsed = parseAddOptions(input, process.cwd());
  const normalizedAgent = normalizeAgentName(agentName);

  if (normalizedAgent.aliased) {
    logger.warn(
      `Using canonical agent name "${normalizedAgent.value}" for "${agentName}".`
    );
  }

  logger.break();
  logger.info(`Adding ${normalizedAgent.value}...`);
  logger.break();

  printSection("Resolving registry");
  const loadSpin = spinner("Resolving source and loading agent...");
  loadSpin.start();
  const registryBase = resolveRegistrySource(parsed.registry, parsed.cwd);
  const item = await loadRegistryItem(normalizedAgent.value, registryBase);
  loadSpin.succeed(`Loaded ${item.name} from registry`);
  logger.info(`  Source: ${registryBase}`);

  let actions = planInstall(item, parsed.cwd, {
    overwrite: parsed.overwrite,
  });
  const summary = {
    create: actions.filter((a) => a.action === "create").map((a) => a.targetPath),
    update: actions.filter((a) => a.action === "update").map((a) => a.targetPath),
    skip: actions.filter((a) => a.action === "skip").map((a) => a.targetPath),
  };

  printSection("Plan summary");
  logger.info(
    `  Files: ${summary.create.length} create, ${summary.update.length} update, ${summary.skip.length} skip`
  );
  if (summary.skip.length > 0 && !parsed.overwrite) {
    logger.info("  Note: existing files are currently marked as skip.");
  }
  if (parsed.verbose) {
    for (const file of summary.create) logger.info(`  + create ${file}`);
    for (const file of summary.update) logger.info(`  ~ update ${file}`);
    for (const file of summary.skip) logger.info(`  - skip   ${file}`);
  }

  if (
    !parsed.dryRun &&
    !parsed.overwrite &&
    summary.skip.length > 0 &&
    !parsed.yes
  ) {
    const shouldOverwrite = await confirm(
      `Found ${summary.skip.length} existing file(s). Overwrite them?`,
      false
    );
    if (shouldOverwrite) {
      actions = planInstall(item, parsed.cwd, { overwrite: true });
    }
  }

  if (parsed.dryRun) {
    logger.info("  Dry run enabled: no files were written.");
  } else {
    printSection("Applying files");
    const applySpin = spinner("Applying file changes...");
    applySpin.start();
    const applied = applyInstallPlan(actions);
    applySpin.succeed("Applied file changes");
    logger.info(
      `  Files: ${applied.created.length} created, ${applied.updated.length} updated, ${applied.skipped.length} skipped`
    );
    if (parsed.verbose) {
      for (const file of applied.created) logger.info(`  ✓ ${file}`);
      for (const file of applied.updated) logger.info(`  ✓ ${file} (updated)`);
      for (const file of applied.skipped) logger.info(`  - ${file} (skipped)`);
    }
  }

  printSection("Config updates");

  let envAdded: string[] = [];
  if (item.envVars && Object.keys(item.envVars).length > 0) {
    const envExamplePath = path.join(parsed.cwd, ".env.example");
    const shouldUpdateEnv =
      parsed.yes || existsSync(envExamplePath)
        ? true
        : await confirm(
            "No .env.example found. Create and append required env keys?",
            true
          );
    if (shouldUpdateEnv) {
      envAdded = mergeEnvExample(parsed.cwd, item.envVars, { dryRun: parsed.dryRun });
    } else {
      logger.info("  Env: skipped");
    }
  }
  if (envAdded.length > 0) {
    logger.info(
      parsed.dryRun
        ? `  Env: would add ${envAdded.join(", ")}`
        : `  Env: updated (${envAdded.join(", ")})`
    );
  }

  const tsconfigUpdated = updateTsconfigPaths(parsed.cwd, { dryRun: parsed.dryRun });
  if (tsconfigUpdated) {
    logger.info(
      parsed.dryRun
        ? "  tsconfig: paths would be updated"
        : "  tsconfig: paths updated"
    );
  }

  printSection("Installing dependencies");
  const shouldInstallDeps =
    parsed.dryRun || parsed.yes
      ? true
      : await confirm("Install agent dependencies now?", true);

  let depsInstalled: string[] = [];
  if (!shouldInstallDeps) {
    logger.info("  Dependencies: skipped by user");
  } else {
  const depSpin = spinner("Installing dependencies...");
    if (!parsed.verbose && !parsed.dryRun) depSpin.start();
    depsInstalled = installDependencies(parsed.cwd, item.dependencies, {
      dryRun: parsed.dryRun,
      verbose: parsed.verbose,
    });
    if (!parsed.verbose && !parsed.dryRun) depSpin.succeed("Dependencies installed");
    if (depsInstalled.length > 0) {
      logger.info(
        parsed.dryRun
          ? `  Dependencies: would install ${depsInstalled.join(", ")}`
          : `  Dependencies: installed ${depsInstalled.join(", ")}`
      );
    } else {
      logger.info("  Dependencies: none required");
    }
  }

  printSection("Done");
  logger.break();
  logger.success("Done!");
  logger.info("Next steps:");
  logger.info("  - Review created/updated files and run your formatter if needed.");
  if (envAdded.length > 0) {
    logger.info(`  - Set environment values: ${envAdded.join(", ")}`);
  }
  logger.info("  - Run your app and test the installed agent flow.");
  logger.info("  - Use --dry-run and --verbose for troubleshooting.");
  logger.break();
}

export const addCommand = new Command("add")
  .description("Add an agent to your project")
  .argument("<agent>", "Agent name (e.g. file-agent)")
  .option("-r, --registry <path|url>", "Registry path or URL")
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--overwrite", "Overwrite existing files", false)
  .option("--verbose", "Show verbose output", false)
  .option("--yes", "Non-interactive mode", false)
  .option("--cwd <path>", "Run command against a target project directory")
  .action((agent: string, options: AddOptionsInput) => runAddCommand(agent, options));

import { Command } from "commander";
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
import { spinner } from "../utils/spinner.js";

export async function runAddCommand(
  agentName: string,
  input: AddOptionsInput
): Promise<void> {
  const parsed = parseAddOptions(input, process.cwd());
  logger.break();
  logger.info(`Adding ${agentName}...`);
  logger.break();

  const loadSpin = spinner("Resolving registry and loading agent...");
  loadSpin.start();
  const registryBase = resolveRegistrySource(parsed.registry, parsed.cwd);
  const item = await loadRegistryItem(agentName, registryBase);
  loadSpin.succeed(`Loaded ${item.name} from registry`);

  const actions = planInstall(item, parsed.cwd, {
    overwrite: parsed.overwrite,
  });
  const summary = {
    create: actions.filter((a) => a.action === "create").map((a) => a.targetPath),
    update: actions.filter((a) => a.action === "update").map((a) => a.targetPath),
    skip: actions.filter((a) => a.action === "skip").map((a) => a.targetPath),
  };

  if (parsed.dryRun) {
    logger.info("Dry run summary:");
    logger.info(
      `  Files: ${summary.create.length} create, ${summary.update.length} update, ${summary.skip.length} skip`
    );
    if (parsed.verbose) {
      for (const file of summary.create) logger.info(`  + create ${file}`);
      for (const file of summary.update) logger.info(`  ~ update ${file}`);
      for (const file of summary.skip) logger.info(`  - skip   ${file}`);
    }
  } else {
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

  const envAdded = item.envVars
    ? mergeEnvExample(parsed.cwd, item.envVars, { dryRun: parsed.dryRun })
    : [];
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

  const depSpin = spinner("Installing dependencies...");
  if (!parsed.verbose && !parsed.dryRun) depSpin.start();
  const depsInstalled = installDependencies(parsed.cwd, item.dependencies, {
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
  }

  logger.break();
  logger.success("Done!");
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

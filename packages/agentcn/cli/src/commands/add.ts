import { Command } from "commander";
import { existsSync } from "node:fs";
import path from "node:path";
import { mergeEnvExample, updateTsconfigPaths } from "../lib/config.js";
import { installDependencies } from "../lib/deps.js";
import { applyInstallPlan, planInstall } from "../lib/install-plan.js";
import { auditDependencies } from "../lib/package-json.js";
import { readProject } from "../lib/project.js";
import {
  loadRegistryItem,
  parseAddOptions,
  resolveRegistrySource,
} from "../lib/registry.js";
import type { AddOptions, AddOptionsInput } from "../types.js";
import { logger } from "../utils/logger.js";
import { type ConfirmFn, handleCancel } from "../utils/prompt.js";
import { printBanner, showIntro, showNote, showOutro } from "../ui/banner.js";
import { confirmProceed, runStep } from "../ui/steps.js";

type AddRuntimeHooks = {
  confirm?: ConfirmFn;
  onCancel?: () => never;
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

function isInteractive(parsed: AddOptions): boolean {
  return !parsed.yes && process.stdout.isTTY === true;
}

async function askConfirm(
  hooks: AddRuntimeHooks,
  message: string,
  defaultValue = true
): Promise<boolean> {
  if (hooks.confirm) {
    return hooks.confirm(message, defaultValue);
  }
  return confirmProceed(message, defaultValue);
}

function cancelInstall(hooks: AddRuntimeHooks): never {
  if (hooks.onCancel) {
    return hooks.onCancel();
  }
  return handleCancel();
}

export async function runAddCommand(
  agentName: string,
  input: AddOptionsInput,
  hooks: AddRuntimeHooks = {}
): Promise<void> {
  const parsed = parseAddOptions(input, process.cwd());
  const normalizedAgent = normalizeAgentName(agentName);
  const interactive = isInteractive(parsed);

  if (interactive) {
    printBanner();
  }

  if (normalizedAgent.aliased) {
    logger.warn(
      `Using canonical agent name "${normalizedAgent.value}" for "${agentName}".`
    );
  }

  const project = readProject(parsed.cwd);

  if (interactive) {
    showIntro(normalizedAgent.value);
  } else {
    logger.info(`Adding ${normalizedAgent.value}...`);
    logger.break();
  }

  logger.dim(
    `Project: ${project.name} (${project.packageManager})${project.isNextJs ? " · Next.js" : ""}`
  );

  if (!project.isNextJs && !parsed.yes) {
    const proceed = await askConfirm(
      hooks,
      "Next.js was not detected in this directory. Agents are designed for Next.js apps. Continue anyway?",
      false
    );
    if (!proceed) {
      cancelInstall(hooks);
    }
  } else if (!project.isNextJs && parsed.yes) {
    logger.warn(
      "Next.js was not detected. Proceeding because --yes was passed."
    );
  }

  const registryBase = await runStep("Loading agent from registry", async () =>
    resolveRegistrySource(parsed.registry, parsed.cwd)
  );

  const item = await runStep(`Fetching ${normalizedAgent.value}`, async () =>
    loadRegistryItem(normalizedAgent.value, registryBase)
  );

  logger.dim(`  Registry: ${registryBase}`);

  if (!parsed.yes) {
    const agentLabel = item.title ?? item.name;
    const proceed = await askConfirm(
      hooks,
      `Ready to install ${agentLabel} into your project?`,
      true
    );
    if (!proceed) {
      cancelInstall(hooks);
    }
  }

  const requiredDeps = item.dependencies ?? [];
  const depAudit = auditDependencies(parsed.cwd, requiredDeps);

  if (requiredDeps.length > 0) {
    if (depAudit.installed.length > 0) {
      logger.dim(
        `  Already installed: ${depAudit.installed.join(", ")}`
      );
    }

    if (depAudit.missing.length > 0) {
      const missingList = depAudit.missing.join(", ");
      if (interactive) {
        showNote(
          `This agent needs ${depAudit.missing.length} package${depAudit.missing.length === 1 ? "" : "s"} your project does not have yet:\n${missingList}`
        );
      } else {
        logger.info(
          `Missing dependencies: ${missingList}`
        );
      }

      const shouldInstallDeps =
        parsed.dryRun || parsed.yes
          ? true
          : await askConfirm(
              hooks,
              `Should I install ${depAudit.missing.length === 1 ? "it" : "them"} for you first?`,
              true
            );

      if (!shouldInstallDeps) {
        cancelInstall(hooks);
      }

      const depResult = await runStep("Installing dependencies", async () =>
        installDependencies(parsed.cwd, requiredDeps, {
          dryRun: parsed.dryRun,
          verbose: parsed.verbose,
        })
      );

      if (parsed.dryRun) {
        logger.info(
          `  Would install: ${depResult.installed.join(", ") || "none"}`
        );
      } else if (depResult.installed.length > 0) {
        logger.success(`  Installed: ${depResult.installed.join(", ")}`);
      } else {
        logger.success("  All required dependencies are already installed.");
      }
    } else {
      logger.success("  All required dependencies are already installed.");
    }
  }

  let actions = planInstall(item, parsed.cwd, {
    overwrite: parsed.overwrite,
  });
  const summary = {
    create: actions.filter((a) => a.action === "create").map((a) => a.targetPath),
    update: actions.filter((a) => a.action === "update").map((a) => a.targetPath),
    skip: actions.filter((a) => a.action === "skip").map((a) => a.targetPath),
  };

  const targetDir =
    summary.create[0] ?? summary.update[0] ?? summary.skip[0];
  const installFolder = targetDir
    ? path.dirname(targetDir)
    : "ai/agents";

  logger.info(
    `  Files: ${summary.create.length} to add, ${summary.update.length} to update, ${summary.skip.length} skipped`
  );

  if (parsed.verbose) {
    for (const file of summary.create) logger.dim(`  + ${file}`);
    for (const file of summary.update) logger.dim(`  ~ ${file}`);
    for (const file of summary.skip) logger.dim(`  - ${file}`);
  }

  if (
    !parsed.dryRun &&
    !parsed.overwrite &&
    summary.skip.length > 0 &&
    !parsed.yes
  ) {
    const shouldOverwrite = await askConfirm(
      hooks,
      `Found ${summary.skip.length} existing file(s). Overwrite them?`,
      false
    );
    if (shouldOverwrite) {
      actions = planInstall(item, parsed.cwd, { overwrite: true });
    }
  }

  if (parsed.dryRun) {
    logger.info(`  Dry run: would add files under ${installFolder}/`);
  } else {
    const applied = await runStep(`Adding files to ${installFolder}/`, async () =>
      applyInstallPlan(actions)
    );
    logger.success(
      `  ${applied.created.length} created, ${applied.updated.length} updated, ${applied.skipped.length} skipped`
    );
    if (parsed.verbose) {
      for (const file of applied.created) logger.dim(`  ✓ ${file}`);
      for (const file of applied.updated) logger.dim(`  ✓ ${file} (updated)`);
      for (const file of applied.skipped) logger.dim(`  - ${file} (skipped)`);
    }
  }

  let envAdded: string[] = [];
  if (item.envVars && Object.keys(item.envVars).length > 0) {
    const envExamplePath = path.join(parsed.cwd, ".env.example");
    const shouldUpdateEnv =
      parsed.yes || existsSync(envExamplePath)
        ? true
        : await askConfirm(
            hooks,
            "No .env.example found. Create and append required env keys?",
            true
          );
    if (shouldUpdateEnv) {
      envAdded = mergeEnvExample(parsed.cwd, item.envVars, {
        dryRun: parsed.dryRun,
      });
    } else {
      logger.dim("  Env: skipped");
    }
  }

  if (envAdded.length > 0) {
    logger.info(
      parsed.dryRun
        ? `  Env: would add ${envAdded.join(", ")}`
        : `  Env: added ${envAdded.join(", ")} to .env.example`
    );
  }

  const tsconfigUpdated = updateTsconfigPaths(parsed.cwd, {
    dryRun: parsed.dryRun,
  });
  if (tsconfigUpdated) {
    logger.info(
      parsed.dryRun
        ? "  tsconfig: paths would be updated"
        : "  tsconfig: paths updated"
    );
  }

  const agentLabel = item.title ?? item.name;
  const nextSteps: string[] = [
    "Review created files and run your formatter if needed.",
  ];
  if (envAdded.length > 0) {
    nextSteps.push(`Set environment values: ${envAdded.join(", ")}`);
  }
  nextSteps.push(
    `Import the agent from your chat route (e.g. @/agents/${normalizedAgent.value.replace(/-agent$/, "")}).`
  );
  nextSteps.push("Run your app and test the installed agent flow.");

  const outroMessage = `${agentLabel} ${parsed.dryRun ? "install preview complete" : "installed successfully"}.\n${nextSteps.map((step) => `• ${step}`).join("\n")}`;

  if (interactive) {
    showOutro(outroMessage);
  } else {
    logger.break();
    logger.success(parsed.dryRun ? "Dry run complete." : "Done!");
    logger.info("Next steps:");
    for (const step of nextSteps) {
      logger.info(`  - ${step}`);
    }
    logger.info("  - Use --dry-run and --verbose for troubleshooting.");
    logger.break();
  }
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

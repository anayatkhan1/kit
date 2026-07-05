import { Command } from "commander";
import path from "node:path";
import {
  getMissingEnvKeys,
  mergeEnvExample,
  updateTsconfigPaths,
} from "../lib/config.js";
import { detectPackageManager, installDependencies } from "../lib/deps.js";
import { applyInstallPlan, planInstall } from "../lib/install-plan.js";
import { auditDependencies } from "../lib/package-json.js";
import { readProject } from "../lib/project.js";
import {
  loadRegistryItem,
  parseAddOptions,
  resolveRegistrySource,
} from "../lib/registry.js";
import type { AddOptions, AddOptionsInput, RegistryItem } from "../types.js";
import { logger } from "../utils/logger.js";
import { type ConfirmFn, handleCancel } from "../utils/prompt.js";
import { printBanner, showIntro, showNote, showOutro } from "../ui/banner.js";
import {
  buildOutroMessage,
  depsInstallConfirm,
  depsInstalled,
  depsInstallingWithPm,
  depsNeeded,
  depsReady,
  envAlreadySet,
  envConfirm,
  envNeeded,
  envUpdated,
  envUpdating,
  fetchAgent,
  filesAdding,
  filesDone,
} from "../ui/copy.js";
import { confirmProceed, runStep } from "../ui/steps.js";

type AddRuntimeHooks = {
  confirm?: ConfirmFn;
  onCancel?: () => never;
};

const AGENT_ALIASES: Record<string, string> = {
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

function agentImportPath(agentId: string): string {
  return `@/agents/${agentId.replace(/-agent$/, "")}`;
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

async function fetchAgentFromRegistry(
  parsed: AddOptions,
  agentId: string
): Promise<{ item: RegistryItem; registryBase: string }> {
  return runStep(fetchAgent(agentId), async () => {
    const registryBase = resolveRegistrySource(parsed.registry, parsed.cwd);
    const item = await loadRegistryItem(agentId, registryBase);
    return { item, registryBase };
  });
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

  const { item, registryBase } = await fetchAgentFromRegistry(
    parsed,
    normalizedAgent.value
  );

  if (parsed.verbose) {
    logger.dim(`  Registry: ${registryBase}`);
  }

  const agentLabel = item.title ?? item.name;
  const requiredDeps = item.dependencies ?? [];
  const depAudit = auditDependencies(parsed.cwd, requiredDeps);

  if (requiredDeps.length > 0) {
    if (depAudit.missing.length > 0) {
      if (interactive) {
        showNote(depsNeeded(agentLabel, depAudit.missing));
      } else {
        logger.info(`Missing dependencies: ${depAudit.missing.join(", ")}`);
      }

      const shouldInstallDeps =
        parsed.dryRun || parsed.yes
          ? true
          : await askConfirm(hooks, depsInstallConfirm(), true);

      if (!shouldInstallDeps) {
        cancelInstall(hooks);
      }

      const packageManager = detectPackageManager(parsed.cwd);
      const depResult = await runStep(
        depsInstallingWithPm(packageManager, depAudit.missing),
        async () =>
          installDependencies(parsed.cwd, requiredDeps, {
            dryRun: parsed.dryRun,
            verbose: parsed.verbose,
          }),
        { successLabel: depsInstalled() }
      );

      if (parsed.dryRun) {
        logger.info(
          `  Would install: ${depResult.installed.join(", ") || "none"}`
        );
      } else if (depResult.installed.length > 0) {
        logger.dim(`  ${depResult.installed.join(", ")}`);
      }
    } else {
      logger.success(`  ${depsReady()}`);
      if (parsed.verbose && depAudit.installed.length > 0) {
        logger.dim(`  ${depAudit.installed.join(", ")}`);
      }
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
  const installFolder = targetDir ? path.dirname(targetDir) : "ai/agents";

  if (parsed.verbose) {
    logger.info(
      `  Files: ${summary.create.length} to add, ${summary.update.length} to update, ${summary.skip.length} skipped`
    );
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

  const envVarKeys = item.envVars ? Object.keys(item.envVars) : [];
  let envAdded: string[] = [];

  if (parsed.dryRun) {
    logger.info(`  Dry run: would add files under ${installFolder}/`);
  } else {
    const applied = await runStep(filesAdding(), async () =>
      applyInstallPlan(actions)
    );
    const fileCount = applied.created.length + applied.updated.length;
    logger.success(`  ${filesDone(fileCount, installFolder)}`);
    if (parsed.verbose) {
      for (const file of applied.created) logger.dim(`  ✓ ${file}`);
      for (const file of applied.updated) logger.dim(`  ✓ ${file} (updated)`);
      for (const file of applied.skipped) logger.dim(`  - ${file} (skipped)`);
    }
  }

  if (item.envVars && envVarKeys.length > 0) {
    const missingEnvKeys = getMissingEnvKeys(parsed.cwd, item.envVars);

    if (missingEnvKeys.length === 0) {
      logger.success(`  ${envAlreadySet()}`);
    } else {
      if (interactive) {
        showNote(envNeeded(agentLabel, missingEnvKeys));
      }

      const shouldUpdateEnv =
        parsed.dryRun || parsed.yes
          ? true
          : await askConfirm(hooks, envConfirm(), true);

      if (shouldUpdateEnv) {
        envAdded = await runStep(envUpdating(), async () =>
          mergeEnvExample(parsed.cwd, item.envVars!, {
            dryRun: parsed.dryRun,
          })
        );

        if (parsed.dryRun) {
          logger.info(`  Would add: ${envAdded.join(", ")}`);
        } else if (envAdded.length > 0) {
          logger.success(`  ${envUpdated(envAdded)}`);
        }
      } else {
        logger.dim("  Env: skipped");
      }
    }
  }

  const tsconfigUpdated = updateTsconfigPaths(parsed.cwd, {
    dryRun: parsed.dryRun,
  });
  if (tsconfigUpdated && parsed.verbose) {
    logger.info(
      parsed.dryRun
        ? "  tsconfig: paths would be updated"
        : "  tsconfig: paths updated"
    );
  }

  const outroEnvKeys =
    envAdded.length > 0 ? envAdded : envVarKeys;
  const outroMessage = buildOutroMessage(agentLabel, parsed.dryRun, {
    envKeys: outroEnvKeys,
    agentImportPath: agentImportPath(normalizedAgent.value),
  });

  if (interactive) {
    showOutro(outroMessage);
  } else {
    logger.break();
    logger.success(parsed.dryRun ? "Dry run complete." : "Done!");
    logger.info("Next steps:");
    for (const step of outroMessage.split("\n").slice(1)) {
      logger.info(`  ${step}`);
    }
    if (parsed.verbose) {
      logger.info("  - Use --dry-run and --verbose for troubleshooting.");
    }
    logger.break();
  }
}

export const addCommand = new Command("add")
  .description("Add an agent to your project")
  .argument("<agent>", "Agent name (e.g. web-agent)")
  .option("-r, --registry <path|url>", "Registry path or URL")
  .option("--dry-run", "Preview changes without writing files", false)
  .option("--overwrite", "Overwrite existing files", false)
  .option("--verbose", "Show verbose output", false)
  .option("--yes", "Non-interactive mode", false)
  .option("--cwd <path>", "Run command against a target project directory")
  .action((agent: string, options: AddOptionsInput) => runAddCommand(agent, options));

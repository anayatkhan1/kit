import * as path from "path";
import { execSync } from "child_process";
import { pathExistsSync } from "path-exists";
import { logger } from "../utils/logger.js";

export function detectPackageManager(cwd: string): "npm" | "pnpm" | "yarn" {
  if (pathExistsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (pathExistsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installDependencies(
  cwd: string,
  dependencies: string[] | undefined,
  options: { dryRun: boolean; verbose: boolean }
): string[] {
  const deps = dependencies ?? [];
  if (deps.length === 0) return [];
  if (options.dryRun) return deps;
  const pm = detectPackageManager(cwd);
  const depString = deps.join(" ");
  const cmd =
    pm === "pnpm"
      ? `pnpm add ${depString}`
      : pm === "yarn"
        ? `yarn add ${depString}`
        : `npm install ${depString}`;

  const runInstall = (installCmd: string) =>
    execSync(installCmd, {
      cwd,
      stdio: options.verbose ? "inherit" : "pipe",
      encoding: options.verbose ? undefined : "utf-8",
    });

  try {
    runInstall(cmd);
  } catch (error) {
    const message =
      error && typeof error === "object" && "stderr" in error
        ? String((error as { stderr?: unknown }).stderr ?? "")
        : error instanceof Error
          ? error.message
          : String(error);

    if (pm === "pnpm" && message.includes("ERR_PNPM_ADDING_TO_ROOT")) {
      // When target cwd is a workspace root, pnpm requires explicit -w.
      try {
        runInstall(`pnpm add -w ${depString}`);
      } catch (fallbackError) {
        if (!options.verbose) {
          const fallbackMsg =
            fallbackError && typeof fallbackError === "object" && "stderr" in fallbackError
              ? String((fallbackError as { stderr?: unknown }).stderr ?? "")
              : String(fallbackError);
          if (fallbackMsg.trim().length > 0) logger.error(fallbackMsg);
        }
        throw fallbackError;
      }
    } else {
      if (!options.verbose && message.trim().length > 0) {
        logger.error(message);
      }
      throw error;
    }
  }
  return deps;
}

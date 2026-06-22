import * as path from "path";
import { spawn } from "node:child_process";
import { pathExistsSync } from "path-exists";
import { auditDependencies } from "./package-json.js";
import { logger } from "../utils/logger.js";

type ExecErrorLike = {
  stdout?: unknown;
  stderr?: unknown;
  message?: unknown;
};

export type InstallDependenciesResult = {
  installed: string[];
  skipped: string[];
};

export function getExecErrorOutput(error: unknown): string {
  if (!error || typeof error !== "object") {
    return String(error ?? "");
  }

  const execError = error as ExecErrorLike;
  const message = String(execError.message ?? "");
  const stdout = String(execError.stdout ?? "");
  const stderr = String(execError.stderr ?? "");

  return [message, stdout, stderr].filter(Boolean).join("\n");
}

export function detectPackageManager(cwd: string): "npm" | "pnpm" | "yarn" {
  if (pathExistsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (pathExistsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function runInstallCommand(
  installCmd: string,
  cwd: string,
  verbose: boolean
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(installCmd, {
      cwd,
      shell: true,
      stdio: verbose ? "inherit" : "pipe",
    });

    let stdout = "";
    let stderr = "";

    if (!verbose && child.stdout) {
      child.stdout.on("data", (chunk: Buffer | string) => {
        stdout += String(chunk);
      });
    }
    if (!verbose && child.stderr) {
      child.stderr.on("data", (chunk: Buffer | string) => {
        stderr += String(chunk);
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      const error = new Error(
        `Install command failed with exit code ${code ?? "unknown"}`
      ) as Error & { stdout?: string; stderr?: string };
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
  });
}

export async function installDependencies(
  cwd: string,
  dependencies: string[] | undefined,
  options: { dryRun: boolean; verbose: boolean }
): Promise<InstallDependenciesResult> {
  const deps = dependencies ?? [];
  if (deps.length === 0) {
    return { installed: [], skipped: [] };
  }

  const audit = auditDependencies(cwd, deps);
  if (audit.missing.length === 0) {
    return { installed: [], skipped: audit.installed };
  }

  if (options.dryRun) {
    return { installed: audit.missing, skipped: audit.installed };
  }

  const pm = detectPackageManager(cwd);
  const depString = audit.missing.join(" ");
  const cmd =
    pm === "pnpm"
      ? `pnpm add ${depString}`
      : pm === "yarn"
        ? `yarn add ${depString}`
        : `npm install ${depString}`;

  try {
    await runInstallCommand(cmd, cwd, options.verbose);
  } catch (error) {
    const message = getExecErrorOutput(error);

    if (pm === "pnpm" && message.includes("ERR_PNPM_ADDING_TO_ROOT")) {
      try {
        await runInstallCommand(`pnpm add -w ${depString}`, cwd, options.verbose);
      } catch (fallbackError) {
        if (!options.verbose) {
          const fallbackMsg = getExecErrorOutput(fallbackError);
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

  return { installed: audit.missing, skipped: audit.installed };
}

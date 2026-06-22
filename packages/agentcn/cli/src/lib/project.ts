import * as fs from "node:fs";
import * as path from "node:path";
import { pathExistsSync } from "path-exists";
import { detectPackageManager } from "./deps.js";

export type ProjectInfo = {
  name: string;
  cwd: string;
  hasPackageJson: boolean;
  isNextJs: boolean;
  packageManager: "npm" | "pnpm" | "yarn";
};

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const NEXT_CONFIG_FILES = [
  "next.config.js",
  "next.config.ts",
  "next.config.mjs",
  "next.config.cjs",
];

export function hasNextConfig(cwd: string): boolean {
  return NEXT_CONFIG_FILES.some((file) => pathExistsSync(path.join(cwd, file)));
}

export function isNextJsProject(packageJson: PackageJson, cwd: string): boolean {
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  if ("next" in deps) return true;
  return hasNextConfig(cwd);
}

export function readPackageJson(cwd: string): PackageJson | null {
  const packageJsonPath = path.join(cwd, "package.json");
  if (!pathExistsSync(packageJsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageJson;
  } catch {
    return null;
  }
}

export function readProject(cwd: string): ProjectInfo {
  const packageJson = readPackageJson(cwd);
  if (!packageJson) {
    throw new Error(
      "No package.json found in this directory. Run the command from your project root or pass --cwd <path>."
    );
  }

  return {
    name: packageJson.name ?? path.basename(cwd),
    cwd,
    hasPackageJson: true,
    isNextJs: isNextJsProject(packageJson, cwd),
    packageManager: detectPackageManager(cwd),
  };
}

export function getInstalledDependencyNames(cwd: string): Set<string> {
  const packageJson = readPackageJson(cwd);
  if (!packageJson) return new Set();

  return new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]);
}

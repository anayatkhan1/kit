import { getInstalledDependencyNames } from "./project.js";

export type DependencyAudit = {
  installed: string[];
  missing: string[];
};

export function parseDependencyName(spec: string): string {
  if (spec.startsWith("@")) {
    const parts = spec.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : spec;
  }
  return spec.split("@")[0] ?? spec;
}

export function auditDependencies(
  cwd: string,
  required: string[]
): DependencyAudit {
  const installedNames = getInstalledDependencyNames(cwd);
  const installed: string[] = [];
  const missing: string[] = [];

  for (const dep of required) {
    const name = parseDependencyName(dep);
    if (installedNames.has(name)) {
      installed.push(name);
    } else {
      missing.push(name);
    }
  }

  return { installed, missing };
}

export function getMissingDependencies(
  cwd: string,
  dependencies: string[] | undefined
): string[] {
  const deps = dependencies ?? [];
  if (deps.length === 0) return [];
  return auditDependencies(cwd, deps).missing;
}

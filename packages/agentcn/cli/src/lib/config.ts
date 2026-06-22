import * as fs from "fs";
import * as path from "path";
import { pathExistsSync } from "path-exists";

function parseEnvKeys(content: string): Set<string> {
  const keys = new Set<string>();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=/.exec(trimmed);
    if (match) keys.add(match[1]);
  }
  return keys;
}

export function mergeEnvContent(
  existing: string,
  envVars: Record<string, string>
): { content: string; added: string[] } {
  const existingKeys = parseEnvKeys(existing);
  const additions: string[] = [];
  const added: string[] = [];
  for (const [key, value] of Object.entries(envVars)) {
    if (!existingKeys.has(key)) {
      additions.push(`# Required for agent\n${key}=${value}`);
      added.push(key);
    }
  }
  if (additions.length === 0) return { content: existing, added };
  const prefix = existing.trim().length > 0 ? `${existing.trimEnd()}\n\n` : "";
  return { content: `${prefix}${additions.join("\n")}\n`, added };
}

export function getMissingEnvKeys(
  cwd: string,
  envVars: Record<string, string>
): string[] {
  const envPath = path.join(cwd, ".env.example");
  const existing = pathExistsSync(envPath)
    ? fs.readFileSync(envPath, "utf-8")
    : "";
  const { added } = mergeEnvContent(existing, envVars);
  return added;
}

export function mergeEnvExample(
  cwd: string,
  envVars: Record<string, string>,
  options: { dryRun: boolean }
): string[] {
  const envPath = path.join(cwd, ".env.example");
  const existing = pathExistsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";
  const { content, added } = mergeEnvContent(existing, envVars);
  if (!options.dryRun && content !== existing) {
    fs.writeFileSync(envPath, content, "utf-8");
  }
  return added;
}

export function updateTsconfigPaths(
  cwd: string,
  options: { dryRun: boolean }
): boolean {
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  if (!pathExistsSync(tsconfigPath)) return false;
  try {
    const content = fs.readFileSync(tsconfigPath, "utf-8");
    const config = JSON.parse(content) as {
      compilerOptions?: { paths?: Record<string, string[]> };
    };
    const compilerOptions = config.compilerOptions ?? {};
    const paths = compilerOptions.paths ?? {};
    let changed = false;
    if (!paths["@/agents/*"]) {
      paths["@/agents/*"] = ["./ai/agents/*"];
      changed = true;
    }
    if (!paths["@/tools/*"]) {
      paths["@/tools/*"] = ["./ai/tools/*"];
      changed = true;
    }
    compilerOptions.paths = paths;
    config.compilerOptions = compilerOptions;
    if (changed && !options.dryRun) {
      fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2), "utf-8");
    }
    return changed;
  } catch {
    return false;
  }
}

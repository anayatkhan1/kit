import * as fs from "fs";
import * as path from "path";
import { pathExistsSync } from "path-exists";
import {
  addOptionsSchema,
  registryIndexSchema,
  registryItemSchema,
} from "../schemas.js";
import { REGISTRY_SCHEMA_VERSION } from "../constants.js";
import type {
  AddOptions,
  AddOptionsInput,
  RegistryIndex,
  RegistryItem,
} from "../types.js";

function isHttpUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function parseAddOptions(
  input: AddOptionsInput,
  cwd: string
): AddOptions {
  const parsed = addOptionsSchema.parse(input);
  return {
    registry: parsed.registry,
    dryRun: parsed.dryRun,
    overwrite: parsed.overwrite,
    yes: parsed.yes,
    verbose: parsed.verbose,
    cwd: parsed.cwd ? path.resolve(cwd, parsed.cwd) : cwd,
  };
}

export function resolveRegistrySource(
  registryPath: string | undefined,
  cwd: string
): string {
  if (registryPath) {
    if (isHttpUrl(registryPath)) return registryPath;
    const resolved = path.resolve(cwd, registryPath);
    if (pathExistsSync(resolved)) return resolved;
  }

  const envRegistry = process.env.AGENTCN_REGISTRY_URL?.trim();
  if (envRegistry) {
    if (isHttpUrl(envRegistry)) return envRegistry;
    const resolved = path.resolve(cwd, envRegistry);
    if (pathExistsSync(resolved)) return resolved;
  }

  const scriptDir = path.dirname(process.argv[1] || cwd);
  const localRegistry = path.resolve(scriptDir, "../../../../apps/web/public/r");
  if (pathExistsSync(localRegistry)) return localRegistry;
  return "https://agentcn.dev/r";
}

async function loadJson(source: string): Promise<unknown> {
  if (isHttpUrl(source)) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${source} (${res.status})`);
    }
    return res.json();
  }
  if (!pathExistsSync(source)) {
    throw new Error(`File not found: ${source}`);
  }
  return JSON.parse(fs.readFileSync(source, "utf-8"));
}

function assertSchemaVersion(schemaVersion: number): void {
  if (schemaVersion !== REGISTRY_SCHEMA_VERSION) {
    throw new Error(
      `Registry schema mismatch. Expected ${REGISTRY_SCHEMA_VERSION}, got ${schemaVersion}.`
    );
  }
}

export async function loadRegistryItem(
  agentName: string,
  registryBase: string
): Promise<RegistryItem> {
  const source = isHttpUrl(registryBase)
    ? `${registryBase.replace(/\/$/, "")}/${agentName}.json`
    : path.join(registryBase, `${agentName}.json`);
  const json = await loadJson(source);
  const item = registryItemSchema.parse(json);
  assertSchemaVersion(item.schemaVersion);
  return item satisfies RegistryItem;
}

export async function loadRegistryIndex(
  registryBase: string
): Promise<RegistryIndex> {
  const source = isHttpUrl(registryBase)
    ? `${registryBase.replace(/\/$/, "")}/index.json`
    : path.join(registryBase, "index.json");
  const json = await loadJson(source);
  const index = registryIndexSchema.parse(json);
  assertSchemaVersion(index.schemaVersion);
  return index satisfies RegistryIndex;
}

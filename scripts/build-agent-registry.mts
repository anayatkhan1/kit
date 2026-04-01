/// <reference types="node" />

/**
 * Build agent registry: reads agent source files, injects content, writes public/r/*.json
 * Run: pnpm agentcn:registry:build
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { agents } = require("../registry/registry-agents.ts");
const REGISTRY_SCHEMA_VERSION = 1;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicRDir = path.join(rootDir, "public", "r");

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content: string;
}

interface RegistryItemJson {
  schemaVersion: number;
  name: string;
  type: string;
  description: string;
  title?: string;
  categories?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  envVars?: Record<string, string>;
  files: RegistryFile[];
  meta?: Record<string, unknown>;
}

async function readFileContent(relativePath: string): Promise<string> {
  const fullPath = path.join(rootDir, relativePath);
  try {
    return await fs.readFile(fullPath, "utf-8");
  } catch (err) {
    console.error(`Failed to read ${relativePath}:`, err);
    throw err;
  }
}

async function buildRegistry() {
  console.log("Building agent registry...\n");

  await fs.mkdir(publicRDir, { recursive: true });

  const indexItems: Array<{
    name: string;
    description: string;
    categories?: string[];
  }> = [];

  for (const agent of agents) {
    const files: RegistryFile[] = [];

    for (const file of agent.files) {
      const content = await readFileContent(file.path);
      const target = file.target ?? file.path;
      files.push({
        path: file.path,
        type: file.type,
        target,
        content,
      });
    }

    const item: RegistryItemJson = {
      schemaVersion: REGISTRY_SCHEMA_VERSION,
      name: agent.name,
      type: agent.type,
      description: agent.description,
      title: agent.title,
      categories: agent.categories,
      dependencies: agent.dependencies,
      devDependencies: agent.devDependencies,
      registryDependencies: agent.registryDependencies,
      envVars: agent.envVars,
      files,
      meta: agent.meta,
    };

    const outPath = path.join(publicRDir, `${agent.name}.json`);
    await fs.writeFile(outPath, JSON.stringify(item, null, 2), "utf-8");
    console.log(`  ✓ ${agent.name}.json`);

    indexItems.push({
      name: agent.name,
      description: agent.description,
      categories: agent.categories,
    });
  }

  const index = {
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    name: "agentcn",
    homepage: "https://agentcn.dev",
    items: indexItems,
  };

  await fs.writeFile(
    path.join(publicRDir, "index.json"),
    JSON.stringify(index, null, 2),
    "utf-8"
  );
  console.log(`  ✓ index.json\n`);
  console.log(`Done. ${agents.length} agent(s) built to public/r/`);
}

buildRegistry().catch((err) => {
  console.error(err);
  process.exit(1);
});

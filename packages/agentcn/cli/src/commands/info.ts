import { Command } from "commander";
import { loadRegistryItem, resolveRegistrySource } from "../lib/registry.js";

async function runInfo(agentName: string, options: { registry?: string }) {
  const cwd = process.cwd();
  const registryBase = resolveRegistrySource(options.registry, cwd);
  const item = await loadRegistryItem(agentName, registryBase);

  console.log(`\n${item.title ?? item.name}`);
  console.log(`${item.description}`);
  console.log(`Type: ${item.type}`);
  if (item.categories?.length) {
    console.log(`Categories: ${item.categories.join(", ")}`);
  }
  if (item.dependencies?.length) {
    console.log(`Dependencies: ${item.dependencies.join(", ")}`);
  }
  if (item.envVars && Object.keys(item.envVars).length > 0) {
    console.log(`Env vars: ${Object.keys(item.envVars).join(", ")}`);
  }
  console.log(`Files: ${item.files.length}`);
  for (const file of item.files) {
    console.log(`  - ${file.target ?? file.path}`);
  }
  console.log("");
}

export const infoCommand = new Command("info")
  .description("Show details for a specific agent")
  .argument("<agent>", "Agent name")
  .option("-r, --registry <path|url>", "Registry path or URL")
  .action(runInfo);

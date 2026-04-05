import { Command } from "commander";
import { loadRegistryIndex, resolveRegistrySource } from "../lib/registry.js";

async function runList(options: { registry?: string }) {
  const cwd = process.cwd();
  const registryBase = resolveRegistrySource(options.registry, cwd);
  const index = await loadRegistryIndex(registryBase);
  console.log(`\nAvailable agents in ${index.name}:\n`);
  for (const item of index.items) {
    const categories = item.categories?.length
      ? ` (${item.categories.join(", ")})`
      : "";
    console.log(`- ${item.name}${categories}`);
    console.log(`  ${item.description}`);
  }
  console.log("");
}

export const listCommand = new Command("list")
  .description("List available agents from registry")
  .option("-r, --registry <path|url>", "Registry path or URL")
  .action(runList);

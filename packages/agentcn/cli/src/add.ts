import * as fs from "fs";
import * as path from "path";
import { pathExistsSync } from "path-exists";
import { Command } from "commander";

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: string;
  description: string;
  dependencies?: string[];
  envVars?: Record<string, string>;
  files: RegistryFile[];
}

function getRegistryUrl(registryPath: string | undefined): string {
  if (registryPath) {
    if (registryPath.startsWith("http")) return registryPath;
    const resolved = path.resolve(process.cwd(), registryPath);
    if (pathExistsSync(resolved)) return resolved;
  }
  // Default: monorepo kit/public/r (packages/agentcn/cli/dist -> ../../../public/r)
  const scriptDir = path.dirname(process.argv[1] || process.cwd());
  const localRegistry = path.resolve(scriptDir, "../../../public/r");
  if (pathExistsSync(localRegistry)) return localRegistry;
  return "http://localhost:3000/r";
}

async function fetchRegistryItem(
  agentName: string,
  registryBase: string
): Promise<RegistryItem> {
  if (registryBase.startsWith("http")) {
    const url = `${registryBase.replace(/\/$/, "")}/${agentName}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Agent "${agentName}" not found at ${url}`);
    return res.json();
  }
  const filePath = path.join(registryBase, `${agentName}.json`);
  if (!pathExistsSync(filePath)) {
    throw new Error(`Agent "${agentName}" not found at ${filePath}`);
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function detectPackageManager(cwd: string): "npm" | "pnpm" | "yarn" {
  if (pathExistsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (pathExistsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function mergeEnvExample(cwd: string, envVars: Record<string, string>) {
  const envPath = path.join(cwd, ".env.example");
  let existing = "";
  if (pathExistsSync(envPath)) {
    existing = fs.readFileSync(envPath, "utf-8");
  }
  const lines: string[] = [];
  for (const [key, value] of Object.entries(envVars)) {
    if (!existing.includes(`${key}=`)) {
      lines.push(`# Required for agent\n${key}=${value}`);
    }
  }
  if (lines.length > 0) {
    const toAppend = "\n\n" + lines.join("\n") + "\n";
    fs.appendFileSync(envPath, toAppend);
  }
}

function addTsconfigPaths(cwd: string) {
  const tsconfigPath = path.join(cwd, "tsconfig.json");
  if (!pathExistsSync(tsconfigPath)) return;
  try {
    const content = fs.readFileSync(tsconfigPath, "utf-8");
    const config = JSON.parse(content);
    const comp = config.compilerOptions ?? {};
    const paths = comp.paths ?? {};
    if (!paths["@/agents/*"]) {
      paths["@/agents/*"] = ["./ai/agents/*"];
    }
    if (!paths["@/tools/*"]) {
      paths["@/tools/*"] = ["./ai/tools/*"];
    }
    comp.paths = paths;
    config.compilerOptions = comp;
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
  } catch {
    // skip if tsconfig is invalid
  }
}

async function runAdd(agentName: string, options: { registry?: string }) {
  const cwd = process.cwd();
  const registryBase = getRegistryUrl(options.registry);

  console.log(`\n  Adding ${agentName}...\n`);

  const item = await fetchRegistryItem(agentName, registryBase);

  for (const file of item.files) {
    const target = file.target ?? file.path;
    const destPath = path.join(cwd, target);
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, file.content, "utf-8");
    console.log(`  ✓ ${target}`);
  }

  if (item.envVars && Object.keys(item.envVars).length > 0) {
    mergeEnvExample(cwd, item.envVars);
    console.log(`  ✓ .env.example updated`);
  }

  addTsconfigPaths(cwd);
  console.log(`  ✓ tsconfig paths updated`);

  if (item.dependencies && item.dependencies.length > 0) {
    const pm = detectPackageManager(cwd);
    const deps = item.dependencies.join(" ");
    console.log(`\n  Installing dependencies: ${deps}\n`);
    const { execSync } = await import("child_process");
    const cmd =
      pm === "pnpm"
        ? `pnpm add ${deps}`
        : pm === "yarn"
          ? `yarn add ${deps}`
          : `npm install ${deps}`;
    execSync(cmd, { cwd, stdio: "inherit" });
  }

  const agentVarLower = agentName.split("-")[0] + "Agent";

  console.log(`\n  Done! Add an API route to use the agent:\n`);
  console.log(`  // app/api/chat/route.ts (Next.js App Router)`);
  console.log(`  import { ${agentVarLower} } from "@/agents/${agentName}";`);
  console.log(`  import { convertToModelMessages } from "ai";`);
  console.log(`  // const result = ${agentVarLower}(modelMessages);`);
  console.log(`  // return result.toUIMessageStreamResponse();\n`);
}

export const addCommand = new Command("add")
  .description("Add an agent to your project")
  .argument("<agent>", "Agent name (e.g. file-agent)")
  .option(
    "-r, --registry <path|url>",
    "Registry path or URL (default: kit/public/r when present, else http://localhost:3000/r)"
  )
  .action(runAdd);

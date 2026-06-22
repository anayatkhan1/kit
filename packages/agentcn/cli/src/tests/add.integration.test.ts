import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { runAddCommand } from "../commands/add.js";

function createRegistry(registryDir: string): void {
  mkdirSync(registryDir, { recursive: true });
  writeFileSync(
    path.join(registryDir, "index.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        name: "agentcn",
        items: [{ name: "file-agent", description: "File agent" }],
      },
      null,
      2
    ),
    "utf-8"
  );
  writeFileSync(
    path.join(registryDir, "file-agent.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        name: "file-agent",
        type: "registry:agent",
        description: "File agent",
        dependencies: [],
        envVars: { ANTHROPIC_API_KEY: "" },
        files: [
          {
            path: "ai/agents/file-agent/index.ts",
            type: "registry:agent",
            content: "export const ok = true;\n",
          },
        ],
      },
      null,
      2
    ),
    "utf-8"
  );
}

function createProject(projectDir: string): void {
  mkdirSync(projectDir, { recursive: true });
  writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(
      {
        name: "test-project",
        dependencies: { next: "16.0.0" },
      },
      null,
      2
    ),
    "utf-8"
  );
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");
}

test("runAddCommand applies files for local path registry", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-local-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);

  try {
    await runAddCommand("file-agent", {
      registry: registryDir,
      cwd: projectDir,
      yes: true,
    });
    const target = path.join(projectDir, "ai/agents/file-agent/index.ts");
    const content = readFileSync(target, "utf-8");
    assert.equal(content.includes("ok = true"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand dry-run does not write files", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-dry-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);
  try {
    await runAddCommand("file-agent", {
      registry: registryDir,
      cwd: projectDir,
      dryRun: true,
      yes: true,
    });
    const target = path.join(projectDir, "ai/agents/file-agent/index.ts");
    assert.equal(
      (() => {
        try {
          readFileSync(target, "utf-8");
          return true;
        } catch {
          return false;
        }
      })(),
      false
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand supports alias agent name", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-alias-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);

  try {
    await runAddCommand("fileagent", {
      registry: registryDir,
      cwd: projectDir,
      yes: true,
    });
    const target = path.join(projectDir, "ai/agents/file-agent/index.ts");
    const content = readFileSync(target, "utf-8");
    assert.equal(content.includes("ok = true"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand in --yes mode skips interactive prompts", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-yes-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);
  const existingTarget = path.join(projectDir, "ai/agents/file-agent/index.ts");
  mkdirSync(path.dirname(existingTarget), { recursive: true });
  writeFileSync(existingTarget, "export const existing = true;\n", "utf-8");

  let promptCalls = 0;
  const confirm = async () => {
    promptCalls += 1;
    return false;
  };

  try {
    await runAddCommand(
      "file-agent",
      {
        registry: registryDir,
        cwd: projectDir,
        dryRun: true,
        yes: true,
      },
      { confirm }
    );
    assert.equal(promptCalls, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand prompts for overwrite when conflicts exist", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-prompt-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);
  const existingTarget = path.join(projectDir, "ai/agents/file-agent/index.ts");
  mkdirSync(path.dirname(existingTarget), { recursive: true });
  writeFileSync(existingTarget, "export const existing = true;\n", "utf-8");

  const prompts: string[] = [];
  const confirm = async (message: string) => {
    prompts.push(message);
    if (message.includes("Overwrite")) return false;
    return true;
  };

  try {
    await runAddCommand(
      "file-agent",
      {
        registry: registryDir,
        cwd: projectDir,
      },
      { confirm }
    );
    assert.equal(
      prompts.some((message) => message.includes("Overwrite")),
      true
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand prompts for env keys when missing from .env.example", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-env-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);

  const prompts: string[] = [];
  const confirm = async (message: string) => {
    prompts.push(message);
    return true;
  };

  try {
    await runAddCommand(
      "file-agent",
      {
        registry: registryDir,
        cwd: projectDir,
      },
      { confirm }
    );
    assert.equal(
      prompts.some((message) => message.includes(".env.example")),
      true
    );
    assert.equal(
      prompts.some((message) => message.includes("Ready to install")),
      false
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand prints structured output in non-interactive mode", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-output-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  createProject(projectDir);
  createRegistry(registryDir);

  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    await runAddCommand("file-agent", {
      registry: registryDir,
      cwd: projectDir,
      dryRun: true,
      yes: true,
    });
    const output = logs.join("\n");
    assert.equal(output.includes("Adding file-agent"), true);
    assert.equal(output.includes("Next.js"), true);
    assert.equal(output.includes("Dry run"), true);
    assert.equal(output.includes("would add files under"), true);
    assert.equal(output.includes(".env.local"), true);
  } finally {
    console.log = originalLog;
    rmSync(root, { recursive: true, force: true });
  }
});

test("runAddCommand warns and proceeds for non-Next.js project with --yes", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-non-next-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  mkdirSync(projectDir, { recursive: true });
  writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify({ name: "plain-node" }, null, 2),
    "utf-8"
  );
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");
  createRegistry(registryDir);

  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "));
  };

  try {
    await runAddCommand("file-agent", {
      registry: registryDir,
      cwd: projectDir,
      yes: true,
    });
    assert.equal(
      warnings.some((line) => line.includes("Next.js was not detected")),
      true
    );
    const target = path.join(projectDir, "ai/agents/file-agent/index.ts");
    assert.equal(readFileSync(target, "utf-8").includes("ok = true"), true);
  } finally {
    console.warn = originalWarn;
    rmSync(root, { recursive: true, force: true });
  }
});

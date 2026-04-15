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

test("runAddCommand applies files for local path registry", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-local-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  mkdirSync(projectDir, { recursive: true });
  createRegistry(registryDir);
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");

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
  mkdirSync(projectDir, { recursive: true });
  createRegistry(registryDir);
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");
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
  mkdirSync(projectDir, { recursive: true });
  createRegistry(registryDir);
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");

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
  mkdirSync(projectDir, { recursive: true });
  createRegistry(registryDir);
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");
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
  mkdirSync(projectDir, { recursive: true });
  createRegistry(registryDir);
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");
  const existingTarget = path.join(projectDir, "ai/agents/file-agent/index.ts");
  mkdirSync(path.dirname(existingTarget), { recursive: true });
  writeFileSync(existingTarget, "export const existing = true;\n", "utf-8");

  const prompts: string[] = [];
  const confirm = async (message: string) => {
    prompts.push(message);
    return false;
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

test("runAddCommand prints structured output sections", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-add-output-"));
  const projectDir = path.join(root, "project");
  const registryDir = path.join(root, "registry");
  mkdirSync(projectDir, { recursive: true });
  createRegistry(registryDir);
  writeFileSync(path.join(projectDir, "tsconfig.json"), "{}", "utf-8");

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
    assert.equal(output.includes("Resolving registry"), true);
    assert.equal(output.includes("Plan summary"), true);
    assert.equal(output.includes("Config updates"), true);
    assert.equal(output.includes("Installing dependencies"), true);
    assert.equal(output.includes("Next steps:"), true);
  } finally {
    console.log = originalLog;
    rmSync(root, { recursive: true, force: true });
  }
});

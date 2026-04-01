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

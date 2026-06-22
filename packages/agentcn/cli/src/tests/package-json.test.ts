import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  auditDependencies,
  getMissingDependencies,
  parseDependencyName,
} from "../lib/package-json.js";

function writePackageJson(
  cwd: string,
  deps: Record<string, string> = {},
  devDeps: Record<string, string> = {}
): void {
  writeFileSync(
    path.join(cwd, "package.json"),
    JSON.stringify(
      {
        name: "audit-test",
        dependencies: deps,
        devDependencies: devDeps,
      },
      null,
      2
    ),
    "utf-8"
  );
}

test("parseDependencyName handles scoped packages", () => {
  assert.equal(parseDependencyName("@ai-sdk/anthropic"), "@ai-sdk/anthropic");
});

test("auditDependencies splits installed and missing packages", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-audit-"));
  try {
    writePackageJson(root, {
      ai: "5.0.0",
      "@ai-sdk/anthropic": "2.0.0",
      zod: "4.0.0",
    });

    const audit = auditDependencies(root, [
      "ai",
      "@ai-sdk/anthropic",
      "zod",
      "exa-js",
      "playwright-core",
    ]);

    assert.deepEqual(audit.installed, ["ai", "@ai-sdk/anthropic", "zod"]);
    assert.deepEqual(audit.missing, ["exa-js", "playwright-core"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("getMissingDependencies returns only missing package names", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-missing-"));
  try {
    writePackageJson(root, { ai: "5.0.0" });
    const missing = getMissingDependencies(root, ["ai", "exa-js"]);
    assert.deepEqual(missing, ["exa-js"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("auditDependencies treats devDependencies as installed", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-dev-deps-"));
  try {
    writePackageJson(root, {}, { "exa-js": "2.0.0" });
    const audit = auditDependencies(root, ["exa-js"]);
    assert.deepEqual(audit.missing, []);
    assert.deepEqual(audit.installed, ["exa-js"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

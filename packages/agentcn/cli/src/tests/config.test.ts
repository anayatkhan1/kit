import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { mergeEnvContent, getMissingEnvKeys, updateTsconfigPaths } from "../lib/config.js";

test("mergeEnvContent appends only missing env keys", () => {
  const existing = "EXISTING_KEY=value\nANTHROPIC_API_KEY=already";
  const { content, added } = mergeEnvContent(existing, {
    ANTHROPIC_API_KEY: "",
    NEW_KEY: "abc",
  });
  assert.deepEqual(added, ["NEW_KEY"]);
  assert.equal(content.includes("NEW_KEY=abc"), true);
  assert.equal(content.includes("ANTHROPIC_API_KEY=already"), true);
});

test("getMissingEnvKeys returns only keys not in .env.example", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "agentcn-env-missing-"));
  try {
    writeFileSync(
      path.join(dir, ".env.example"),
      "ANTHROPIC_API_KEY=already\n",
      "utf-8"
    );
    const missing = getMissingEnvKeys(dir, {
      ANTHROPIC_API_KEY: "",
      EXA_API_KEY: "",
    });
    assert.deepEqual(missing, ["EXA_API_KEY"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("getMissingEnvKeys returns all keys when .env.example is missing", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "agentcn-env-none-"));
  try {
    const missing = getMissingEnvKeys(dir, {
      ANTHROPIC_API_KEY: "",
      EXA_API_KEY: "",
    });
    assert.deepEqual(missing, ["ANTHROPIC_API_KEY", "EXA_API_KEY"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("updateTsconfigPaths adds ai aliases", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "agentcn-tsconfig-"));
  try {
    const tsconfigPath = path.join(dir, "tsconfig.json");
    writeFileSync(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { strict: true } }, null, 2),
      "utf-8"
    );
    const changed = updateTsconfigPaths(dir, { dryRun: false });
    assert.equal(changed, true);
    const updated = JSON.parse(readFileSync(tsconfigPath, "utf-8"));
    assert.deepEqual(updated.compilerOptions.paths["@/agents/*"], [
      "./ai/agents/*",
    ]);
    assert.deepEqual(updated.compilerOptions.paths["@/tools/*"], [
      "./ai/tools/*",
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

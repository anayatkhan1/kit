import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { getExecErrorOutput, installDependencies } from "../lib/deps.js";

test("getExecErrorOutput includes stdout and stderr", () => {
  const message = getExecErrorOutput({
    message: "Command failed",
    stdout: "ERR_PNPM_ADDING_TO_ROOT",
    stderr: "",
  });

  assert.equal(message.includes("Command failed"), true);
  assert.equal(message.includes("ERR_PNPM_ADDING_TO_ROOT"), true);
});

test("installDependencies skips packages already in package.json", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-deps-skip-"));
  try {
    writeFileSync(
      path.join(root, "package.json"),
      JSON.stringify(
        {
          name: "deps-test",
          dependencies: { ai: "5.0.0", zod: "4.0.0" },
        },
        null,
        2
      ),
      "utf-8"
    );

    const result = installDependencies(root, ["ai", "zod"], {
      dryRun: true,
      verbose: false,
    });

    assert.deepEqual(result.installed, []);
    assert.deepEqual(result.skipped.sort(), ["ai", "zod"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("installDependencies dry-run reports only missing packages", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-deps-missing-"));
  try {
    writeFileSync(
      path.join(root, "package.json"),
      JSON.stringify({ name: "deps-test", dependencies: { ai: "5.0.0" } }, null, 2)
    );

    const result = installDependencies(root, ["ai", "exa-js"], {
      dryRun: true,
      verbose: false,
    });

    assert.deepEqual(result.installed, ["exa-js"]);
    assert.deepEqual(result.skipped, ["ai"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

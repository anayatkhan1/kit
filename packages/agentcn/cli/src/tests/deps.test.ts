import assert from "node:assert/strict";
import test from "node:test";
import { getExecErrorOutput } from "../lib/deps.js";

test("getExecErrorOutput includes stdout and stderr", () => {
  const message = getExecErrorOutput({
    message: "Command failed",
    stdout: "ERR_PNPM_ADDING_TO_ROOT",
    stderr: "",
  });

  assert.equal(message.includes("Command failed"), true);
  assert.equal(message.includes("ERR_PNPM_ADDING_TO_ROOT"), true);
});

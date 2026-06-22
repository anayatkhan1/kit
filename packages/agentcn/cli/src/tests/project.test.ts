import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  hasNextConfig,
  isNextJsProject,
  readProject,
} from "../lib/project.js";

function createProject(
  root: string,
  options: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    nextConfig?: boolean;
  } = {}
): string {
  const projectDir = path.join(root, "project");
  mkdirSync(projectDir, { recursive: true });
  writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(
      {
        name: "test-app",
        dependencies: options.dependencies ?? {},
        devDependencies: options.devDependencies ?? {},
      },
      null,
      2
    ),
    "utf-8"
  );
  if (options.nextConfig) {
    writeFileSync(
      path.join(projectDir, "next.config.ts"),
      "export default {}\n",
      "utf-8"
    );
  }
  return projectDir;
}

test("readProject throws when package.json is missing", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-project-"));
  try {
    assert.throws(() => readProject(root), /No package\.json found/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("readProject detects Next.js from dependencies", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-project-next-dep-"));
  try {
    const projectDir = createProject(root, {
      dependencies: { next: "16.0.0" },
    });
    const project = readProject(projectDir);
    assert.equal(project.isNextJs, true);
    assert.equal(project.name, "test-app");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("readProject detects Next.js from next.config.ts", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-project-next-config-"));
  try {
    const projectDir = createProject(root, { nextConfig: true });
    const project = readProject(projectDir);
    assert.equal(project.isNextJs, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("readProject reports non-Next.js projects", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-project-plain-"));
  try {
    const projectDir = createProject(root);
    const project = readProject(projectDir);
    assert.equal(project.isNextJs, false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("isNextJsProject returns false without next dependency or config", () => {
  assert.equal(isNextJsProject({ dependencies: { react: "19.0.0" } }, "/tmp"), false);
});

test("hasNextConfig detects next.config files", () => {
  const root = mkdtempSync(path.join(tmpdir(), "agentcn-next-config-"));
  try {
    mkdirSync(root, { recursive: true });
    assert.equal(hasNextConfig(root), false);
    writeFileSync(path.join(root, "next.config.mjs"), "export default {}\n", "utf-8");
    assert.equal(hasNextConfig(root), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

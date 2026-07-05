import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  loadRegistryIndex,
  loadRegistryItem,
  resolveRegistrySource,
} from "../lib/registry.js";

test("loads registry index and item from URL", async () => {
  const index = {
    schemaVersion: 1,
    name: "agentcn",
    items: [{ name: "web-agent", description: "Web agent" }],
  };
  const item = {
    schemaVersion: 1,
    name: "web-agent",
    type: "registry:agent",
    description: "Web agent",
    files: [],
  };

  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/index.json") {
      res.end(JSON.stringify(index));
      return;
    }
    if (req.url === "/web-agent.json") {
      res.end(JSON.stringify(item));
      return;
    }
    res.statusCode = 404;
    res.end("{}");
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Failed to get server port");
  }
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const loadedIndex = await loadRegistryIndex(baseUrl);
    const loadedItem = await loadRegistryItem("web-agent", baseUrl);
    assert.equal(loadedIndex.items.length, 1);
    assert.equal(loadedItem.name, "web-agent");
  } finally {
    server.close();
  }
});

test("uses env registry URL when provided", () => {
  const previous = process.env.AGENTCN_REGISTRY_URL;
  process.env.AGENTCN_REGISTRY_URL = "http://localhost:3000/r";

  try {
    const source = resolveRegistrySource(undefined, process.cwd());
    assert.equal(source, "http://localhost:3000/r");
  } finally {
    if (previous === undefined) {
      delete process.env.AGENTCN_REGISTRY_URL;
    } else {
      process.env.AGENTCN_REGISTRY_URL = previous;
    }
  }
});

test("registry arg path takes precedence over env", () => {
  const previous = process.env.AGENTCN_REGISTRY_URL;
  const tempDir = mkdtempSync(path.join(tmpdir(), "agentcn-registry-"));
  process.env.AGENTCN_REGISTRY_URL = "https://agentcn.dev/r";

  try {
    const source = resolveRegistrySource(tempDir, process.cwd());
    assert.equal(source, tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
    if (previous === undefined) {
      delete process.env.AGENTCN_REGISTRY_URL;
    } else {
      process.env.AGENTCN_REGISTRY_URL = previous;
    }
  }
});

test("uses local bundled registry path or production fallback", () => {
  const previous = process.env.AGENTCN_REGISTRY_URL;
  delete process.env.AGENTCN_REGISTRY_URL;

  try {
    const source = resolveRegistrySource(undefined, process.cwd());
    assert.ok(
      source === "https://agentcn.dev/r" ||
        source.endsWith("/apps/web/public/r")
    );
  } finally {
    if (previous !== undefined) {
      process.env.AGENTCN_REGISTRY_URL = previous;
    }
  }
});

test("throws on schema mismatch", async () => {
  const server = createServer((_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        schemaVersion: 2,
        name: "agentcn",
        items: [],
      })
    );
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Failed to get server port");
  }

  try {
    await assert.rejects(
      () => loadRegistryIndex(`http://127.0.0.1:${address.port}`),
      /Registry schema mismatch/
    );
  } finally {
    server.close();
  }
});

test("throws on malformed index payload", async () => {
  const server = createServer((_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ schemaVersion: 1 }));
  });

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Failed to get server port");
  }

  try {
    await assert.rejects(
      () => loadRegistryIndex(`http://127.0.0.1:${address.port}`),
      /name|items/
    );
  } finally {
    server.close();
  }
});

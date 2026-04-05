import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { loadRegistryIndex, loadRegistryItem } from "../lib/registry.js";

test("loads registry index and item from URL", async () => {
  const index = {
    schemaVersion: 1,
    name: "agentcn",
    items: [{ name: "file-agent", description: "File agent" }],
  };
  const item = {
    schemaVersion: 1,
    name: "file-agent",
    type: "registry:agent",
    description: "File agent",
    files: [],
  };

  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/index.json") {
      res.end(JSON.stringify(index));
      return;
    }
    if (req.url === "/file-agent.json") {
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
    const loadedItem = await loadRegistryItem("file-agent", baseUrl);
    assert.equal(loadedIndex.items.length, 1);
    assert.equal(loadedItem.name, "file-agent");
  } finally {
    server.close();
  }
});

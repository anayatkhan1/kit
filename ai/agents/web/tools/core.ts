import Exa from "exa-js";
import * as fs from "fs";
import * as path from "path";

export const WEB_AGENT_BASE_DIR = path.join(
  process.cwd(),
  "data",
  "web-agent.local"
);

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function safeFileName(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
}

export function getExaClient() {
  const exaApiKey = process.env["EXA_API_KEY"];
  if (!exaApiKey) {
    throw new Error("EXA_API_KEY is not set.");
  }
  return new Exa(exaApiKey);
}

export function getAnchorApiKey() {
  const anchorApiKey = process.env["ANCHOR_API_KEY"];
  if (!anchorApiKey) {
    throw new Error("ANCHOR_API_KEY is not set.");
  }
  return anchorApiKey;
}

export function saveArtifact(folder: string, fileName: string, payload: unknown) {
  const dirPath = path.join(WEB_AGENT_BASE_DIR, folder);
  ensureDir(dirPath);

  const fullPath = path.join(dirPath, fileName);
  fs.writeFileSync(fullPath, JSON.stringify(payload, null, 2), "utf8");

  return path.relative(WEB_AGENT_BASE_DIR, fullPath);
}

export function buildTaskMetadata(taskName: string) {
  return {
    task_name: safeFileName(taskName),
    created_at: new Date().toISOString(),
  };
}

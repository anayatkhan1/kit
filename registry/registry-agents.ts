/**
 * Registry definitions for installable agents.
 * Each entry describes an agent: files, dependencies, env vars.
 * Used by scripts/build-agent-registry.mts to produce public/r/*.json
 */

export type RegistryAgentItem = {
  name: string;
  type: "registry:agent";
  description: string;
  title?: string;
  categories?: string[];
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  envVars?: Record<string, string>;
  files: Array<{
    path: string;
    type: string;
    target?: string;
  }>;
  meta?: Record<string, unknown>;
};

export const agents: RegistryAgentItem[] = [
  {
    name: "file-agent",
    type: "registry:agent",
    description:
      "File system agent with read, write, delete, list, create, exists, and search tools. Uses a sandboxed directory.",
    title: "File Agent",
    categories: ["file-system", "productivity"],
    dependencies: ["ai", "@ai-sdk/anthropic", "zod"],
    envVars: {
      ANTHROPIC_API_KEY: "",
    },
    files: [
      { path: "ai/agents/file-agent/index.ts", type: "registry:agent" },
      { path: "ai/agents/file-agent/agent.ts", type: "registry:agent" },
      { path: "ai/agents/file-agent/prompt.ts", type: "registry:agent" },
      { path: "ai/tools/file-system/index.ts", type: "registry:lib" },
      { path: "ai/tools/file-system/toolset.ts", type: "registry:lib" },
      { path: "ai/tools/file-system/schema.ts", type: "registry:lib" },
      { path: "ai/tools/file-system/core.ts", type: "registry:lib" },
      { path: "ai/tools/file-system/types.ts", type: "registry:lib" },
    ],
    meta: {
      hasMockMode: false,
      providers: ["anthropic"],
    },
  },
];

/**
 * Registry definitions for installable agents.
 * Each entry describes an agent: files, dependencies, env vars.
 * Used by scripts/build-agent-registry.mts to produce apps/web/public/r/*.json
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
  {
    name: "web-agent",
    type: "registry:agent",
    description:
      "Web research agent with search, answer, deep research, browser automation (Anchor), and websets via Exa.",
    title: "Web Agent",
    categories: ["web", "research", "browser"],
    dependencies: [
      "ai",
      "@ai-sdk/anthropic",
      "zod",
      "exa-js",
      "playwright-core",
    ],
    envVars: {
      ANTHROPIC_API_KEY: "",
      EXA_API_KEY: "",
      ANCHOR_API_KEY: "",
    },
    files: [
      { path: "ai/agents/web/index.ts", type: "registry:agent" },
      { path: "ai/agents/web/agent.ts", type: "registry:agent" },
      { path: "ai/agents/web/prompt.ts", type: "registry:agent" },
      { path: "ai/agents/web/tools/index.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/toolset.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/schema.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/types.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/core.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/web-search.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/answer-question.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/deep-research.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/use-browser.ts", type: "registry:lib" },
      { path: "ai/agents/web/tools/webset.ts", type: "registry:lib" },
      {
        path: "ai/agents/web/tools/services/anchor.ts",
        type: "registry:lib",
      },
    ],
    meta: {
      hasMockMode: false,
      providers: ["anthropic", "exa", "anchor"],
    },
  },
];

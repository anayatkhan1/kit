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
  {
    name: "extraction-agent",
    type: "registry:agent",
    description:
      "Extract information from PDFs, spreadsheets, and images with citations, then save results locally.",
    title: "Extraction Agent",
    categories: ["extraction", "documents", "spreadsheets"],
    dependencies: [
      "ai",
      "@ai-sdk/anthropic",
      "zod",
      "pdf-lib",
      "xlsx",
    ],
    envVars: {
      ANTHROPIC_API_KEY: "",
    },
    files: [
      { path: "ai/agents/extraction/index.ts", type: "registry:agent" },
      { path: "ai/agents/extraction/agent.ts", type: "registry:agent" },
      { path: "ai/agents/extraction/prompt.ts", type: "registry:agent" },
      { path: "ai/agents/extraction/tools/index.ts", type: "registry:lib" },
      { path: "ai/agents/extraction/tools/toolset.ts", type: "registry:lib" },
      { path: "ai/agents/extraction/tools/schema.ts", type: "registry:lib" },
      { path: "ai/agents/extraction/tools/types.ts", type: "registry:lib" },
      { path: "ai/agents/extraction/tools/core.ts", type: "registry:lib" },
      {
        path: "ai/agents/extraction/tools/get-document-metadata.ts",
        type: "registry:lib",
      },
      {
        path: "ai/agents/extraction/tools/document-information-extraction.ts",
        type: "registry:lib",
      },
      {
        path: "ai/agents/extraction/tools/get-sheet-metadata.ts",
        type: "registry:lib",
      },
      {
        path: "ai/agents/extraction/tools/spreadsheet-information-extraction.ts",
        type: "registry:lib",
      },
      {
        path: "ai/agents/extraction/tools/image-information-extraction.ts",
        type: "registry:lib",
      },
      {
        path: "ai/agents/extraction/tools/save-extraction.ts",
        type: "registry:lib",
      },
    ],
    meta: {
      hasMockMode: false,
      providers: ["anthropic"],
    },
  },
];

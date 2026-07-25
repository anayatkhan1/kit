# Agent anatomy — source layout & templates

Reference implementation: `ai/agents/web/` (distributed as `web-agent`). Copy this
structure verbatim for a new agent, replacing the short folder name `web` and
the tool set. Registry/docs/demo/CLI use `<short>-agent` (e.g. `web-agent`).

## Directory layout

```
ai/agents/<short>/          # e.g. web — NOT web-agent
├── index.ts              # public entry: re-exports the agent
├── agent.ts              # the agent (streamText call)
├── prompt.ts            # SYSTEM_PROMPT string
├── tools/
│   ├── index.ts          # re-exports the toolset
│   ├── toolset.ts        # { tool_name: toolDef } passed to the agent
│   ├── schema.ts         # zod input schemas (one per tool)
│   ├── core.ts           # shared clients + env-var guards + helpers
│   ├── types.ts          # shared TS types (optional)
│   ├── <tool>.ts         # one file per tool (tool({...}))
│   └── services/
│       └── <service>.ts  # external API client wrappers (optional)
└── test/                 # local only — omit from registry files
    ├── test-helpers.ts   # describeIf<Provider> guards
    └── <tool>.test.ts    # one suite per tool
```

## Layer 1 — `index.ts`

Thin public surface. Consumers import from `@/agents/<short>` (maps to
`ai/agents/<short>`).

```ts
export { webAgent } from "./agent";
```

## Layer 2 — `agent.ts`

The agent is a plain function that returns a `streamText` result. It wires the
model, system prompt, tools, and a stop condition. Keep it this small — all the
behavior lives in the prompt and tools.

```ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type ModelMessage, stepCountIs } from "ai";
import { SYSTEM_PROMPT } from "./prompt";
import { webToolset } from "./tools";

export function webAgent(messages: ModelMessage[]) {
  return streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    messages,
    tools: webToolset,
    stopWhen: [stepCountIs(20)],
  });
}
```

Notes:
- **`messages: ModelMessage[]`** in, streaming result out. The caller (an API
  route, script, or the demo app) owns the transport.
- **`stopWhen: [stepCountIs(20)]`** caps the tool-use loop. Tune per agent.
- Keep the model choice consistent across agents unless there's a reason.

## Layer 3 — `prompt.ts`

Export a single `SYSTEM_PROMPT` constant. Describe the agent's role, when to use
each tool, and output/citation rules. Keep tool names in the prompt exactly
matching the `toolset.ts` keys.

```ts
export const SYSTEM_PROMPT = `You are a web research agent.
...
Use web_search for quick lookups. Use deep_research for multi-source reports.
Always cite sources as markdown links.`;
```

## Layer 4 — Tools

### `tools/schema.ts` — validation

One zod schema per tool. Use `.describe()` on every field — the model reads
these descriptions.

```ts
import { z } from "zod";

export const webSearchSchema = z.object({
  query: z.string().describe("The search query."),
  num_results: z
    .number()
    .int()
    .min(1)
    .max(25)
    .optional()
    .default(5)
    .describe("Maximum number of search results."),
});
```

### `tools/core.ts` — shared clients & env guards

Centralize provider clients and secret access. Every secret read throws a clear
error when missing (never silently fall back).

```ts
import Exa from "exa-js";

export function getExaClient() {
  const exaApiKey = process.env["EXA_API_KEY"];
  if (!exaApiKey) {
    throw new Error("EXA_API_KEY is not set.");
  }
  return new Exa(exaApiKey);
}
```

Put filesystem/artifact helpers here too if the agent persists output (the
web-agent writes to `data/<name>.local/` via `saveArtifact`).

### `tools/<tool>.ts` — a tool

Each tool is `tool({ description, inputSchema, execute })`. `execute` receives
the validated, typed args. Return a serializable object; a `success` flag plus a
`content` payload is the house style.

```ts
import { tool } from "ai";
import { getExaClient } from "./core";
import { webSearchSchema } from "./schema";

export const webSearchTool = tool({
  description: "Search the web for up-to-date information.",
  inputSchema: webSearchSchema,
  execute: async ({ query, num_results }) => {
    const exa = getExaClient();
    const { results } = await exa.searchAndContents(query, {
      numResults: num_results,
      highlights: true,
    });
    return {
      success: true,
      content: results.map((r) => ({
        title: r.title,
        url: r.url,
        content: r.highlights.join("\n"),
      })),
    };
  },
});
```

### `tools/toolset.ts` — the map

Keys are the tool names the model calls (and what you name in the prompt).

```ts
import { ToolSet } from "ai";
import { webSearchTool } from "./web-search";
import { answerQuestionTool } from "./answer-question";

export const webToolset = {
  web_search: webSearchTool,
  answer_question: answerQuestionTool,
} as ToolSet;
```

### `tools/index.ts`

```ts
export { webToolset } from "./toolset";
```

## Layer 5 — Tests

Live-API tests are gated so CI/local runs without keys don't fail.

`test/test-helpers.ts`:

```ts
import { describe } from "@jest/globals";
declare const process: { env: Record<string, string | undefined> };

export const describeIfExa =
  process.env.EXA_API_KEY ? describe : describe.skip;
```

`test/web-search.test.ts`:

```ts
import { describeIfExa } from "./test-helpers";

describeIfExa("web_search (live)", () => {
  it("returns results", async () => {
    // ... call the tool's execute and assert on shape
  });
});
```

Run: `pnpm jest ai/agents/<name>`.

> Tests that hit a real provider will fail without network + keys — that's
> expected. Gate them behind `describeIf<Provider>` so they skip cleanly.

# Docs page & simulated demo

Every agent gets a docs page and a zero-cost simulated demo. The demo replays a
scripted conversation (no live API calls, no keys, no spend) so visitors can see
the agent "work" in the docs.

## Part A — Docs page (MDX)

### 1. Create the page

`apps/web/content/docs/agents/<name>.mdx`. Frontmatter must set
`component: true` (enables the MDX components used below).

```mdx
---
title: Web Agent
description: Web research agent with search, deep research, browser, and websets.
component: true
---

<AgentDemoPreview agentId="web-agent" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx agentcn@latest add web-agent
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install ai @ai-sdk/anthropic zod exa-js playwright-core
```

<Step>Set environment variables in your `.env` file. Get each key from its provider:</Step>

- [ANTHROPIC_API_KEY](https://console.anthropic.com/settings/keys) — Anthropic Console
- [EXA_API_KEY](https://dashboard.exa.ai/api-keys) — Exa Dashboard
- [ANCHOR_API_KEY](https://app.anchorbrowser.io/) — Anchor Browser

```bash
ANTHROPIC_API_KEY=
EXA_API_KEY=
ANCHOR_API_KEY=
```

<Step>Copy the agent files into your project.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

... show importing and calling the agent ...

## Tools

... document each tool: name, purpose, key inputs ...
```

- `<AgentDemoPreview agentId="<name>" />` renders the simulated player. The
  `agentId` **must** match the demo's `agentId` (Part B) and the registry name.
- The dependency list and env vars must match `registry/registry-agents.ts`.

### 2. Register the page in nav

Add the slug to `pages` in `apps/web/content/docs/agents/meta.json`:

```json
{
  "title": "Agents",
  "pages": ["web-agent", "<name>"]
}
```

(The top-level `apps/web/content/docs/meta.json` already includes the `agents`
section — no change needed there.)

## Part B — Simulated demo data

The demo is pure data. You script the prompt, the tool calls, and the final
answer; the player animates it.

### 1. Create the demo config

`apps/web/lib/agent-demos/<name>.ts` exporting an `AgentDemoConfig`.

Types (`apps/web/lib/agent-demos/types.ts`):

```ts
type AgentDemoConfig = {
  agentId: string          // === registry name / docs slug
  label: string
  description: string
  defaultScenarioId: string
  scenarios: AgentDemoScenario[]
}

type AgentDemoScenario = {
  id: string
  label: string            // chip label in the UI
  prompt: string           // the simulated user message
  assistantParts: DemoMessagePart[]
}
```

`DemoMessagePart` is a discriminated union — mix and match to script the run:

- `{ type: "tool", tool: DemoToolName, input: Record<string,string> }` — renders a
  tool step (pending → running → done). `tool` must be one of the known
  `DemoToolName`s; add new names to the union in `types.ts` if your agent has new
  tools.
- `{ type: "text", text: string }` — the assistant's answer. Supports inline
  markdown (bold, links, bullet lines).
- `{ type: "browser_view", ... }` — a simulated browser panel (url, pageTitle,
  navigationSteps, pageContent).
- `{ type: "webset_view", ... }` — a simulated result table (title, columns,
  rows, entityCount).

Example:

```ts
import type { AgentDemoConfig } from "./types"

export const webAgentDemo: AgentDemoConfig = {
  agentId: "web-agent",
  label: "Web Agent",
  description: "Uses web search, deep research, browser automation, and websets.",
  defaultScenarioId: "search",
  scenarios: [
    {
      id: "search",
      label: "Search & cite",
      prompt: "Find top AI coding agents launched this month with citations.",
      assistantParts: [
        { type: "tool", tool: "web_search", input: { query: "AI coding agents 2026" } },
        { type: "tool", tool: "answer_question", input: { question: "Top agents this month?" } },
        {
          type: "text",
          text: `Here are notable agents:\n\n• **Cursor Agent** — IDE-native. [cursor.com](https://cursor.com)`,
        },
      ],
    },
    // add scenarios per capability (deep research, browser, webset, ...)
  ],
}
```

Guidelines:
- Give each scenario a distinct `label` — these become the capability chips.
- Set `defaultScenarioId` to the most representative scenario.
- Keep tool `input` realistic; it's shown to users as the tool call.
- Order `assistantParts` in execution order: tool calls first, rich views next,
  final `text` last.

### 2. Register the demo

Add it to the `agentDemos` map in `apps/web/lib/agent-demos/index.ts`:

```ts
import { webAgentDemo } from "./web-agent"

const agentDemos: Record<string, AgentDemoConfig> = {
  [webAgentDemo.agentId]: webAgentDemo,
}
```

That's it — `<AgentDemoPreview agentId="<name>" />` looks the agent up here.

## Rendering internals (for reference only)

You normally don't edit these; they're generic and already handle any config:

- `apps/web/components/agent-demo-preview.tsx` — the MDX entry component.
- `apps/web/components/agent-demo/agent-demo-player.tsx` — orchestrates replay,
  scenario chips, thinking state, and reveals parts in sequence.
- `agent-demo-message.tsx`, `agent-demo-tool-steps.tsx`, `agent-demo-thinking.tsx`,
  `agent-demo-browser-panel.tsx`, `agent-demo-webset-table.tsx`,
  `agent-demo-formatted-text.tsx`, `agent-demo-input.tsx` — the individual pieces.
- `apps/web/lib/agent-demos/tool-labels.ts` — human labels + view extractors.

Only touch these if you're adding a **new part type** (e.g. a new rich view). In
that case: add the type to `types.ts`, render it in `agent-demo-message.tsx`, and
handle its timing in `agent-demo-player.tsx`.

## Definition of done

- [ ] `apps/web/content/docs/agents/<name>.mdx` created with `<AgentDemoPreview>`.
- [ ] Slug added to `apps/web/content/docs/agents/meta.json`.
- [ ] `apps/web/lib/agent-demos/<name>.ts` created with ≥1 scenario.
- [ ] Registered in `apps/web/lib/agent-demos/index.ts`.
- [ ] `pnpm exec nx run @kit/web:build` passes and the demo replays in the docs.

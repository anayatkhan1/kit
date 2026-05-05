# Agent UI Template (Next.js + Vercel AI SDK)

Reusable example app for validating how different agents behave in a real Next.js chat UI.

This template keeps the same frontend shell while switching agent profiles (tools, system prompt, MCP usage, and stop conditions) from a central registry.

## Included Agent Profiles

- `file-agent`
  - local file-system tools
  - optional GitHub MCP tools (via Docker + PAT)
- `web-agent`
  - web search, question answering, deep research, browser, webset tools

## Why this template exists

- Validate real streaming/tool-call UX before docs/publish.
- Compare multiple agents in one app without route rewrites.
- Reuse as the base demo app for future agent profiles.

## Prerequisites

- Node.js 20+
- pnpm
- Anthropic API key (`ANTHROPIC_API_KEY`)

Optional depending on selected profile:
- `GITHUB_PERSONAL_ACCESS_TOKEN` + Docker (for file-agent MCP mode)
- `EXA_API_KEY` (for web-agent)
- `ANCHOR_API_KEY` (for web-agent browser path)

## Setup

1. Install deps:

```bash
pnpm install
```

2. Create `.env.local`:

```bash
ANTHROPIC_API_KEY=...
GITHUB_PERSONAL_ACCESS_TOKEN=...
EXA_API_KEY=...
ANCHOR_API_KEY=...
```

3. Start app:

```bash
pnpm dev
```

4. Open `http://localhost:3000`, choose an agent profile, and run prompts.

## Key Files

- `tsconfig.json` - `@kit-ai/*` maps to `kit/ai/*` (shared prompts and toolsets; no copied `ai/` tree in this app).
- `app/api/chat/route.ts` - generic streaming route using selected agent config.
- `lib/agent-registry.ts` - profile registry (model, prompt, toolsets, env needs, MCP context).
- `components/message.tsx` - shared chat + tool activity rendering.
- `lib/tool-labels.ts` - normalized labels for tool calls in UI.

## Commands

- `pnpm dev` - start template app
- `pnpm lint` - run Biome checks
- `pnpm format` - format with Biome

## Add a New Agent (5-minute checklist)

Use this flow whenever you add another agent to this template.

1. Add or extend agent source in the shared kit package (single source of truth):
   - `kit/ai/agents/<your-agent>/...`
   - include prompt + tools (and services if needed)
   - import those modules from `lib/agent-registry.ts` using the `@kit-ai/*` path alias (see existing `file-agent` / `web-agent` imports)

2. Register server runtime config in:
   - `lib/agent-registry.ts`
   - required fields:
     - `id`
     - `systemPrompt`
     - `model`
     - `stopWhen`
     - `localTools`
   - optional:
     - `createMcpContext` (only when agent needs MCP transport)

3. Register UI profile metadata in:
   - `lib/agent-profiles.ts`
   - required fields:
     - `id`
     - `label`
     - `description`
     - `starterPrompt`
     - `env`

4. (Optional) Improve tool labels for UI activity in:
   - `lib/tool-labels.ts`
   - add mappings so tool traces are readable in chat.

5. Validate:
   - `pnpm format`
   - `pnpm lint`
   - `pnpm build`
   - `pnpm dev`

If these pass, your new agent profile is available in the UI dropdown on `/`.

# Agent UI Template (Next.js + Vercel AI SDK)

Minimal demo app for running the **web-agent** locally with real API keys.

Docs at [agentcn.dev/docs](https://agentcn.dev/docs) use simulated examples and do not require this app.

## Included

- `web-agent` chat UI on `/`
- Compact embed route at `/embed/web-agent` for local testing

## Prerequisites

- Node.js 20+
- pnpm
- API keys:
  - `ANTHROPIC_API_KEY`
  - `EXA_API_KEY`
  - `ANCHOR_API_KEY`

## Setup

```bash
pnpm install
```

Create `.env.local`:

```bash
ANTHROPIC_API_KEY=...
EXA_API_KEY=...
ANCHOR_API_KEY=...
```

## Commands

- `pnpm dev` — full template app on port 3000
- `pnpm dev:embed` — embed server on port 3001
- `pnpm lint` — Biome checks
- `pnpm build` — production build

## Local embed route

Run the embed server:

```bash
pnpm dev:embed
```

Open `http://localhost:3001/embed/web-agent`.

## Key files

- `app/api/chat/route.ts` — streaming chat route for web-agent
- `app/embed/web-agent/` — compact embed UI
- `lib/agent-registry.ts` — server runtime config
- `lib/agent-profiles.ts` — UI metadata
- `tsconfig.json` — `@kit-ai/*` maps to `kit/ai/*` in the monorepo

## Add another agent to this demo

1. Add source under `kit/ai/agents/<name>/`
2. Register runtime config in `lib/agent-registry.ts`
3. Register UI metadata in `lib/agent-profiles.ts`
4. Add `app/embed/<name>/` if you want a local embed route

See [AgentCN scope docs](https://agentcn.dev/docs/scope) for the full registry + publish workflow.

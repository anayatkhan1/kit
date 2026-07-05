# Agent UI Template (Next.js + Vercel AI SDK)

Minimal demo app for the **web-agent** live preview on [agentcn.dev/docs](https://agentcn.dev/docs).

## Included

- `web-agent` chat UI on `/`
- Compact embed route at `/embed/web-agent` for docs iframe previews

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
- `pnpm dev:embed` — embed server on port 3001 (use this for docs local preview)
- `pnpm lint` — Biome checks
- `pnpm build` — production build

## Docs embed

Point the docs app at this server:

```bash
# in apps/web/.env
NEXT_PUBLIC_AGENT_DEMO_URL=http://localhost:3001
```

Then run:

```bash
pnpm dev:embed
```

Open `http://localhost:3001/embed/web-agent`.

## Key files

- `app/api/chat/route.ts` — streaming chat route for web-agent
- `app/embed/web-agent/` — iframe-friendly embed UI
- `lib/agent-registry.ts` — server runtime config
- `lib/agent-profiles.ts` — UI metadata
- `tsconfig.json` — `@kit-ai/*` maps to `kit/ai/*` in the monorepo

## Add another agent to this demo

1. Add source under `kit/ai/agents/<name>/`
2. Register runtime config in `lib/agent-registry.ts`
3. Register UI metadata in `lib/agent-profiles.ts`
4. Add `app/embed/<name>/` if you want a docs preview route

See [AgentCN scope docs](https://agentcn.dev/docs/scope) for the full registry + publish workflow.

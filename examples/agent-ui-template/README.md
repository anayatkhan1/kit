# Agent UI Template (Next.js + Vercel AI SDK)

Minimal demo app for running agents locally with real API keys.

Docs at [agentcn.dev/docs](https://agentcn.dev/docs) use simulated examples and do not require this app.

## Included

- Chat UI on `/` with agent switcher (`web-agent`, `extraction-agent`, `ecommerce-agent`)
- Compact embed routes:
  - `/embed/web-agent`
  - `/embed/extraction-agent`
  - `/embed/ecommerce-agent`

## Prerequisites

- Node.js 20+
- pnpm
- API keys:
  - `ANTHROPIC_API_KEY` (required for all agents)
  - `EXA_API_KEY` / `ANCHOR_API_KEY` (web-agent only)
  - `FIRECRAWL_API_KEY` (ecommerce-agent only)

## Setup

```bash
pnpm install
```

Create `.env` or `.env.local`:

```bash
ANTHROPIC_API_KEY=...
EXA_API_KEY=...
ANCHOR_API_KEY=...
FIRECRAWL_API_KEY=...
```

Sample extraction files are under `data/extraction-agent.local/` (`invoices/acme.pdf`, `sales/q2.xlsx`, `receipts/cafe.png`).

E-commerce catalogs write to `data/ecommerce-agent.local/` (`maps/`, `schemas/`, `catalogs/`).

## Commands

- `pnpm dev` — full template app on port 3000
- `pnpm dev:embed` — embed server on port 3001
- `pnpm lint` — Biome checks
- `pnpm build` — production build

## Test extraction-agent

1. `pnpm dev`
2. Open `http://localhost:3000`
3. Click **Extraction Agent**
4. Send prompts such as:
   - `Extract invoice number, total, and due date from invoices/acme.pdf`
   - `Summarize Q2 revenue by region from sales/q2.xlsx`
   - `What items and total are on receipts/cafe.png?`

Or open `http://localhost:3001/embed/extraction-agent` after `pnpm dev:embed`.

## Test ecommerce-agent

1. Set `ANTHROPIC_API_KEY` and `FIRECRAWL_API_KEY` in `.env.local`
2. `pnpm dev`
3. Open `http://localhost:3000`
4. Click **E-commerce Agent**
5. Send prompts such as:
   - `Map https://www.firecrawl.dev with limit 20 and summarize the URLs`
   - `Map https://YOUR-SHOPIFY-STORE.com, then extract title/price/stock from the first 3 product URLs and save as smoke-test`

Or open `http://localhost:3001/embed/ecommerce-agent` after `pnpm dev:embed`.

Prefer public Shopify / demo stores first — large marketplaces burn credits and often block scrapers.

## Key files

- `app/api/chat/route.ts` — streaming chat route (reads `agentId`)
- `lib/agent-registry.ts` — server runtime config (tools + prompt)
- `lib/agent-profiles.ts` — UI metadata
- `tsconfig.json` — `@kit-ai/*` maps to `kit/ai/*` in the monorepo

## Add another agent to this demo

1. Add source under `kit/ai/agents/<name>/`
2. Register runtime config in `lib/agent-registry.ts`
3. Register UI metadata in `lib/agent-profiles.ts`
4. Add `app/embed/<name>/` if you want a local embed route

See [AgentCN scope docs](https://agentcn.dev/docs/scope) for the full registry + publish workflow.

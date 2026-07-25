---
name: build-agent
description: Build and ship a new installable agent in this repo, following the web-agent pattern from development to CLI to production. USE WHEN adding a new agent, adding tools to an agent, exposing an agent through the agentcn CLI/registry, writing agent docs, or wiring the docs demo. Trigger words - new agent, add agent, add a tool, register agent, agent registry, agentcn add, agent docs demo.
---

# Build an Agent (dev → CLI → prod)

This skill is the canonical, repeatable recipe for adding a new agent to this
repo. It mirrors the reference implementation, the **web-agent**
(`ai/agents/web/`), which is distributed to users through the `agentcn` CLI.

Follow the checklist top-to-bottom. Each phase links to a deeper reference file
under `references/`. Always copy the existing web-agent conventions instead of
inventing new ones — consistency is what makes the registry + CLI work.

## Mental model

An agent in this repo has **five layers**. Adding an agent means touching each:

1. **Source** — the agent + tools live in `ai/agents/<name>/`. This is the code
   users actually run. (→ `references/agent-anatomy.md`)
2. **Registry** — `registry/registry-agents.ts` declares which files, deps, and
   env vars make up the agent. A build script turns this into static JSON at
   `apps/web/public/r/<name>.json`. (→ `references/registry-cli-prod.md`)
3. **CLI** — `agentcn add <name>` fetches that JSON and installs the agent into a
   user's project. The CLI is generic; you don't edit it per-agent. (→
   `references/registry-cli-prod.md`)
4. **Docs** — `apps/web/content/docs/agents/<name>.mdx` documents install +
   wiring. (→ `references/docs-and-demo.md`)
5. **Demo** — `apps/web/lib/agent-demos/<name>.ts` powers the zero-cost
   simulated preview shown in the docs. (→ `references/docs-and-demo.md`)

## Conventions (do not deviate)

- **Package manager:** `pnpm` (see `packageManager` in root `package.json`).
- **Task runner:** Nx. Prefer `pnpm exec nx run ...` or the root `package.json`
  scripts over calling tools directly.
- **Model:** `anthropic("claude-sonnet-4-5-20250929")` via `@ai-sdk/anthropic`.
- **AI SDK:** Vercel `ai` (`streamText`, `tool`, `stepCountIs`).
- **Tool schemas:** `zod`, defined in a dedicated `schema.ts`, imported by tools.
- **Agent naming (dual, like web-agent):** source folder is the short domain name
  (`ai/agents/web/`); distribution identity is `<short>-agent` for the registry
  `name`, docs slug, demo `agentId`, and CLI (`web-agent`). Code exports use the
  short name (`webAgent`, `webToolset`). Install import is `@/agents/web`.
  Keep these pairs consistent — do not invent a third naming scheme.
- **Env vars:** never hardcode secrets. Read from `process.env` and throw a clear
  error if missing (see `tools/core.ts`).
- **Tests:** live under `ai/agents/<short>/test/` but are **not** listed in the
  registry `files` array (users don't install tests).
- **Porting prototypes:** rebuild against this layout. Never ship proprietary
  imports (`workspace`, `@re-factor/*`, private provider registries).

## Checklist

### Phase 1 — Scaffold the source (`ai/agents/<short>/`)

Copy the web-agent layout. Full templates in `references/agent-anatomy.md`.
Use `<short>` for the folder (e.g. `web`, `extraction`) and `<short>-agent`
for distribution (e.g. `web-agent`, `extraction-agent`).

- [ ] `ai/agents/<short>/index.ts` — re-export: `export { <short>Agent } from "./agent"`.
- [ ] `ai/agents/<short>/agent.ts` — `streamText` call with model, system prompt, tools, `stopWhen`.
- [ ] `ai/agents/<short>/prompt.ts` — the `SYSTEM_PROMPT` string.
- [ ] `ai/agents/<short>/tools/schema.ts` — one zod schema per tool.
- [ ] `ai/agents/<short>/tools/core.ts` — shared clients/helpers + env-var guards.
- [ ] `ai/agents/<short>/tools/<tool>.ts` — one file per tool using `tool({...})`.
- [ ] `ai/agents/<short>/tools/toolset.ts` — map tool names → tool defs.
- [ ] `ai/agents/<short>/tools/index.ts` — `export { <short>Toolset } from "./toolset"`.
- [ ] `ai/agents/<short>/tools/types.ts` — shared TS types (optional).
- [ ] `ai/agents/<short>/tools/services/*.ts` — external API clients (optional).

### Phase 2 — Tests (`ai/agents/<short>/test/`)

- [ ] `test/test-helpers.ts` — `describeIf<Provider>` guards keyed on env vars.
- [ ] `test/<tool>.test.ts` — one suite per tool; live-API suites use the guards.
- [ ] Run `pnpm jest ai/agents/<short>` (and add a root script like `test:web-agent` if useful).

### Phase 3 — Register for distribution

- [ ] Add an entry to the `agents` array in `registry/registry-agents.ts`
      (`name: "<short>-agent"`, description, title, categories, `dependencies`,
      `envVars`, and every Phase 1 file with its `type`; paths use `ai/agents/<short>/...`).
- [ ] Build the registry: `pnpm agentcn:registry:build`.
- [ ] Confirm `apps/web/public/r/<short>-agent.json` and updated `index.json` exist.

### Phase 4 — Docs + demo

- [ ] `apps/web/content/docs/agents/<short>-agent.mdx` — frontmatter (`title`,
      `description`, `component: true`), `<AgentDemoPreview agentId="<short>-agent" />`,
      install tabs, wiring, tools reference.
- [ ] Add the slug to `pages` in `apps/web/content/docs/agents/meta.json`.
- [ ] `apps/web/lib/agent-demos/<short>-agent.ts` — an `AgentDemoConfig` with scenarios.
- [ ] Register it in `apps/web/lib/agent-demos/index.ts` (`agentDemos` map).

### Phase 5 — Verify (dev) and ship (prod)

- [ ] `pnpm exec nx run @kit/web:typecheck`
- [ ] `pnpm exec nx run @kit/web:build`
- [ ] `pnpm deploy:build` (registry build + web build — what prod runs).
- [ ] Optional live check: `pnpm agentcn:registry:verify-live`.
- [ ] Ship: registry JSON deploys with the web app; the CLI is published via
      `nx release` on an `agentcn@*` tag. See `references/registry-cli-prod.md`.

## Quick command reference

```bash
pnpm jest ai/agents/<short>              # run agent tests
pnpm agentcn:registry:build              # regenerate public/r/*.json (REQUIRED after registry edits)
pnpm exec nx run @kit/web:typecheck      # typecheck the web app + agent source
pnpm exec nx run @kit/web:build          # build docs/marketing site
pnpm deploy:build                        # registry build + web build (prod parity)
npx agentcn@latest add <short>-agent     # what a user runs to install your agent
```

## Common mistakes

- **Forgetting `pnpm agentcn:registry:build`** after editing source or the
  registry — the CLI serves stale JSON and installs the old files.
- **Name drift** — folder stays `<short>`; registry `name`, docs slug, and demo
  `agentId` stay `<short>-agent`. Mixing them (e.g. folder `web-agent`) breaks
  imports and the CLI install path.
- **Adding a file to `ai/agents/<short>/` but not to `files` in the registry** —
  the CLI won't install it, so the agent breaks in the user's project.
- **Listing `test/` in registry `files`** — tests are for this repo only; omit them.
- **New dependency not listed in the registry `dependencies`** — user install
  fails at runtime. Keep `dependencies`/`envVars` in sync with the source.

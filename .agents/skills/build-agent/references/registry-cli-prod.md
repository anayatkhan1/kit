# Registry, CLI & production

How agent source in `ai/agents/<name>/` becomes something a user installs with
`npx agentcn@latest add <name>`, and how it reaches production.

## Pipeline overview

```
ai/agents/<name>/*          registry/registry-agents.ts
      (source)          →        (declaration)
                                       │
                                       │  pnpm agentcn:registry:build
                                       ▼
                        apps/web/public/r/<name>.json  +  index.json
                                       │
                                       │  served as static files by the web app
                                       ▼
                          agentcn add <name>  (CLI fetches JSON, writes files)
                                       ▼
                            user's project (installed agent)
```

Two independently shipped artifacts:
1. **Registry JSON** — deploys with the web app (`apps/web/public/r/`).
2. **`agentcn` CLI** — published to npm via `nx release`.

## Step 1 — Declare the agent in the registry

Edit `registry/registry-agents.ts` and add an entry to the `agents` array. The
shape is `RegistryAgentItem`:

```ts
{
  name: "web-agent",                 // === folder / docs slug / demo agentId
  type: "registry:agent",
  description: "Web research agent with search, deep research, browser, websets.",
  title: "Web Agent",
  categories: ["web", "research", "browser"],
  dependencies: ["ai", "@ai-sdk/anthropic", "zod", "exa-js", "playwright-core"],
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
    { path: "ai/agents/web/tools/core.ts", type: "registry:lib" },
    { path: "ai/agents/web/tools/web-search.ts", type: "registry:lib" },
    // ...every file the agent needs to run
  ],
  meta: { providers: ["anthropic", "exa", "anchor"] },
}
```

Rules:
- **Every file** the agent imports at runtime must be listed in `files`. If it's
  not listed, the CLI won't install it.
- `type` is `registry:agent` for the core agent files and `registry:lib` for
  tools/helpers. (An optional `target` overrides the install path; default is the
  same `path`.)
- Keep `dependencies` and `envVars` in sync with what the source actually uses.
  These drive the CLI's dependency install and `.env` scaffolding.

## Step 2 — Build the registry JSON

```bash
pnpm agentcn:registry:build
```

This runs `scripts/build-agent-registry.mts`, which:
- reads each entry from `registry/registry-agents.ts`,
- inlines the **content** of every listed file,
- writes `apps/web/public/r/<name>.json` per agent,
- writes an aggregate `apps/web/public/r/index.json` (drives `agentcn list`).

> ALWAYS re-run this after editing agent source or the registry. The CLI serves
> whatever JSON is committed/deployed, not the live source.

Verify the output exists and includes your new files:
`apps/web/public/r/<name>.json`.

## Step 3 — How the CLI consumes it (no per-agent edits)

The `agentcn` CLI lives in `packages/agentcn/cli/`. It's generic — you do not
change it when adding an agent. For reference:

- `src/commands/add.ts` — `agentcn add <name>`: fetches `r/<name>.json`, builds an
  install plan, installs deps, writes files, scaffolds env vars.
- `src/commands/list.ts` / `info.ts` — read `index.json` / a single item.
- `src/lib/registry.ts` — resolves the registry URL and fetches JSON.
- `src/lib/{deps,package-json,project,config,install-plan}.ts` — install logic.
- Tests: `src/tests/*.test.ts` (run with the CLI's `nx test` target).

You'd only touch the CLI to change *install behavior* for all agents (e.g. a new
`type`, a new config option) — not to add a single agent.

## Step 4 — Verify (dev)

```bash
pnpm jest ai/agents/<name>          # agent unit/live tests
pnpm exec nx run @kit/web:typecheck # typecheck source + web app
pnpm exec nx run @kit/web:build     # build the site (includes docs)
pnpm deploy:build                   # registry build + web build (prod parity)
```

Optional end-to-end registry check against a running/deployed site:

```bash
pnpm agentcn:registry:verify-live      # scripts/verify-agentcn-registry-live.sh
pnpm agentcn:runner-matrix-smoke       # CLI install smoke across package managers
```

## Step 5 — Production

- **Registry JSON** ships automatically: `pnpm deploy:build` runs
  `agentcn:registry:build` then `web:build`, and the JSON under
  `apps/web/public/r/` is deployed as static assets with the web app. Once the
  site deploys, `agentcn add <name>` can install your agent.
- **CLI publishing** (only when the CLI package itself changed): the repo uses
  Nx release.

  ```bash
  pnpm release            # version + changelog + publish
  pnpm release:version    # bump versions only
  pnpm release:changelog  # generate changelog only
  pnpm release:publish    # publish only
  ```

  Publishing is triggered on an `agentcn@*` git tag (see the publish workflow in
  `.github/workflows/`). Adding a new agent usually does **not** require a CLI
  release — only a site deploy with the rebuilt registry.

## Definition of done

- [ ] Entry added to `registry/registry-agents.ts` with all files, deps, env vars.
- [ ] `pnpm agentcn:registry:build` run; `public/r/<name>.json` + `index.json` updated.
- [ ] `pnpm deploy:build` passes.
- [ ] (If applicable) CLI released via `nx release`.

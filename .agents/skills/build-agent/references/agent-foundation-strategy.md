# Agent foundation strategy

**Read this before proposing, scoping, or shipping any new agent.**

AgentCN ships **installable agent foundations** — thin, valuable, extensible source
that users own and improve. We do **not** ship full apps, vendor demo catalogs, or
agents bloated with every possible tool.

The mechanical checklist (files, registry, docs) lives in [SKILL.md](../SKILL.md).
This document is the **product and architecture gate** — how to decide *what* belongs
in the library and *how much* to ship in v1.

## Positioning (one sentence)

> AgentCN ships installable AI agents — real source, real tools, real problems.
> Start with a focused foundation; extend with your own tools.

## What an agent is (and is not)

| AgentCN agent | Not an agentCN agent |
|---------------|----------------------|
| `streamText` + prompt + toolset users edit | Full wizard UI (e.g. firecrawl-migrator) |
| 3–5 core tools that complete one workflow | 15 tools “just in case” |
| Local workspace under `data/<short>-agent.local/` | Black-box npm wrapper with no extension path |
| Docs + simulated demo | Live vendor demo re-hosted as-is |
| One clear job-to-be-done | “Does everything for X platform” |

Reference agents:

- **web-agent** — research on the web (search, answer, browser, websets, deep research)
- **extraction-agent** — extract facts from local PDFs, spreadsheets, images

Both use **one agent, multiple tools** for variants of the same job — not separate
agents per file type or per Firecrawl sidebar category.

## Agent lanes (keep the catalog scannable)

Group new agents by **job**, not by vendor marketing categories.

| Lane | Examples | User question |
|------|----------|---------------|
| **Web** | `web-agent`, future `scrape-agent` | “I need information or data from the web” |
| **Files** | `extraction-agent` | “I have documents/spreadsheets/images locally” |
| **Channels** | future `telegram-agent`, `instagram-agent` | “I need to send/post on a platform” |

Rules:

- **One agent per platform/API** for channels (telegram ≠ instagram ≠ linkedin).
- **Do not** create `social-media-agent` or merge unrelated APIs into one install.
- **Do not** mirror every Firecrawl / VoltAgent / vendor “use case” as a registry agent.

Vendor demo categories (E-commerce, Content Generation, Data Migration, etc.) are
**docs recipes and demo scenarios** inside an existing or new lane agent — not
separate installs unless they are a genuinely different job with different credentials.

## The foundation formula

Every new agent v1 should include:

1. **One job-to-be-done** — describable in one sentence a user would actually say.
2. **3–5 tools max** — enough for one end-to-end workflow, not a feature matrix.
3. **`tools/core.ts`** — API client, env guards, clear errors (not raw vendor 400s).
4. **Workspace** — `data/<short>-agent.local/` for drafts, inputs, outputs, logs.
5. **Prompt routing** — when to use each tool; confirm before destructive actions.
6. **Extension guide in docs** — “Add your own tool” with numbered steps.
7. **1–2 demo scenarios** — simulated preview in docs; optional E2E in `examples/agent-ui-template/`.

### v1 tool budget

| Count | Verdict |
|-------|---------|
| 3–5 tools | Ideal foundation |
| 6–7 tools | Only if each tool is essential to the core workflow |
| 8+ tools | Stop — split, defer to extensions, or you are building the wrong agent |

Defer to **user extensions** (documented, not shipped): captions, trend research,
scheduling UI, analytics dashboards, CMS export formats, multi-platform posting.

## Gate checklist (answer before coding)

Answer **yes** to all before scaffolding:

1. **Distinct job** — Can an existing agent (`web-agent`, `extraction-agent`) already do this with prompt + small tool addition? If yes, extend that agent or add one tool — do not create a new agent.
2. **Real user prompt** — Can you write 2–3 example prompts a developer would actually run?
3. **15-minute install path** — `npx agentcn add <short>-agent` → env keys → chat route → working tool call?
4. **Minimal API surface** — One primary external provider (or clearly justified second). Document cost/limits if usage-based.
5. **Extension story** — Users can add a new tool in `tools/` without forking the agent.
6. **Lane fit** — The homepage/docs can explain where this agent sits in one line.

If **two or more** are “no,” narrow scope or wait.

## Anti-patterns (do not ship)

| Anti-pattern | Why it hurts the library |
|--------------|--------------------------|
| Agent per vendor demo category | Confusing catalog; same engine, different labels |
| Thin API wrapper with no workspace | Users could write 50 lines themselves |
| Tool sprawl on day one | Hard to document, test, and maintain; confuses the model |
| Full UI port from `tmp/` prototypes | Wrong shape — extract tools only |
| Duplicate agents (pdf-agent + sheet-agent) | Use one agent + multiple tools |
| `mega-agent` spanning web + files + social | Key fatigue; no clear install story |
| Features that need cron/scheduling/UI | Out of scope for installable chat agents |

## Scoping examples

### Good: `extraction-agent`

- **Job:** Extract structured facts from local PDFs, sheets, images with citations.
- **Tools:** metadata + extract per type + save (6 tools, same job family).
- **Not in v1:** email extraction, slides, proprietary validation pipelines.

### Good: future `scrape-agent`

- **Job:** Map a site and batch-scrape URLs into structured JSON/CSV.
- **Tools:** `map_site`, `infer_schema`, `batch_scrape`, `save_results`.
- **Docs demos:** ecommerce catalog, blog migration, competitive intel — **one agent**.

### Good: future `telegram-agent`

- **Job:** Send messages and media via Telegram Bot API.
- **Tools:** `send_message`, `send_photo`, `get_chat_info`, `save_outbound_log`.
- **Extensions (docs only):** inline keyboards, broadcasts, payments.

### Bad: seven Firecrawl-category agents

Same Firecrawl key, overlapping `map` + `scrape` tools, user asks “which do I install?”

### Bad: `instagram-agent` with 12 tools

Post, caption, hashtag research, reel trends, analytics, scheduler, DM automation…
Ship **post + read + draft** first; document how to add caption/hashtag tools.

## Extension contract (document in every agent’s docs)

Users extend agents by:

1. Add `tools/<new-tool>.ts` using `tool({ description, inputSchema, execute })`.
2. Add zod schema in `tools/schema.ts`.
3. Register in `tools/toolset.ts`.
4. Update `prompt.ts` — when the agent should call the new tool.
5. Add env vars to `registry/registry-agents.ts` if the tool needs new secrets.
6. Run `pnpm agentcn:registry:build` if shipping upstream (maintainers only).

Optional: add a **“Extend this agent”** section in the agent MDX with one worked example
(e.g. `generate_caption` for instagram-agent).

## Docs vs registry growth

| Grow slowly (quality) | Grow fast (breadth) |
|-----------------------|---------------------|
| Registry agents | Doc example recipes |
| Core toolsets | Demo scenarios |
| CLI install units | “How to add a tool” guides |

**Registry** = installable foundations. **Docs** = use-case inspiration and extensions.

## Quality bar per agent (maintainers)

Before merge:

- [ ] Passes gate checklist above
- [ ] v1 tool count ≤ 7 with justification for each tool
- [ ] `references/agent-anatomy.md` layout followed
- [ ] Tests for core tools (unit + gated live if external API)
- [ ] Docs: install, env, tools table, extension section, demo preview
- [ ] No overlap confusion with existing agents (call out differences in docs)
- [ ] Prototype code in `tmp/` was **rebuilt** to AgentCN layout, not copied wholesale

## Roadmap discipline

1. **Prove the model** — polish existing agents + CLI + docs before adding many new ones.
2. **One new lane or agent at a time** — ship foundation, get feedback.
3. **Expand the lane** — second agent in same lane only after the first is stable.
4. **Community** — extension docs; later, showcase user-added tools.

## When the user says “add an agent”

1. Read this file + [SKILL.md](../SKILL.md).
2. State the **one-sentence job** and **lane**.
3. List **v1 tools** (3–5) and **explicitly defer** everything else.
4. Check overlap with `web-agent` / `extraction-agent`.
5. Only then scaffold `ai/agents/<short>/` and follow the phase checklist.

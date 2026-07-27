Scope, plan, and ship a new AgentCN agent — context first, SPEC in repo, one commit per todo.

## Workflow (follow in order)

Read [implementation-workflow.md](../../.agents/skills/build-agent/references/implementation-workflow.md) for the full picture. Summary:

| Phase | Action | Stop until |
|-------|--------|------------|
| **0 — Intake** | Collect user context (providers, prototype, requirements) | Context is clear |
| **1 — Plan** | Write `ai/agents/<short>/SPEC.md` from template; show plan + gate | User **approves** |
| **2 — Build** | Execute todos 1..N from SPEC; verify each step | All todos done |
| **3 — Ship** | Verify, PR (`/pr-description`), deploy registry | — |

## Required reading (before Phase 1)

1. [agent-foundation-strategy.md](../../.agents/skills/build-agent/references/agent-foundation-strategy.md) — lanes, 3–5 tools, anti-patterns
2. [agent-spec-template.md](../../.agents/skills/build-agent/references/agent-spec-template.md) — SPEC structure
3. [build-agent/SKILL.md](../../.agents/skills/build-agent/SKILL.md) — file-level checklist per phase

## Phase 0 — Context intake

Parse what I provide after `/add-agent`. If missing, ask:

- **Job** — one sentence
- **Lane** — Web | Files | Channels
- **Primary provider** — API/SDK (e.g. Firecrawl, Telegram)
- **Prototype** — path (`tmp/…`), URL, or greenfield
- **Must-have tools** — what v1 must do
- **Env vars** — which keys I will use
- **Out of scope** — what to defer
- **Commits** — `commit each step` | `commit at end` | `no commits` (default: only when I ask)
- **E2E template** — wire in `examples/agent-ui-template/`? yes/no

Do not invent providers or tools I did not specify or that fail the foundation gate.

## Phase 1 — Plan (no tool code)

1. Apply foundation strategy (gate, overlap with `web-agent` / `extraction-agent`).
2. Create `ai/agents/<short>/SPEC.md` using [agent-spec-template.md](../../.agents/skills/build-agent/references/agent-spec-template.md).
3. Fill the **Implementation plan** table with concrete commit messages.
4. Reply with:
   - Link to SPEC path
   - Summary (job, lane, tools, providers)
   - Implementation plan table (todos 0..N)
   - Gate recommendation: **proceed** | **narrow** | **extend existing agent**

**Do not write `agent.ts`, tools, or registry entries until I approve.**

If I included `implement` or `go ahead` in the same message **without** approving a plan, still show the plan first unless I explicitly said to skip approval.

Optional todo 0 commit (when I ask):

```
docs(agent): add <short>-agent spec
```

## Phase 2 — Build (after approval)

Work **one SPEC todo at a time**:

1. Implement only that todo's files
2. Run verify command from SPEC plan row
3. Report done; if I said **commit each step**, create one commit with the planned message
4. Move to next todo

Standard order: source → tests → registry → docs+demo → verify → (optional) agent-ui-template.

Match extraction-agent commit style:

- `feat(agent): add <short>-agent source for …`
- `test(agent): add <short>-agent tests`
- `feat(registry): register <short>-agent`
- `docs(agent): add <short>-agent docs and demo`
- `chore(agent): verify <short>-agent build`
- `feat(examples): wire <short>-agent in agent-ui-template`

Update SPEC `Status` and acceptance checkboxes as you complete work.

## Phase 3 — Ship

- All acceptance criteria in SPEC checked
- Offer `/pr-description` with "implements `ai/agents/<short>/SPEC.md`"
- Remind: production needs web deploy for `npx agentcn add <short>-agent`

## Do not

- Skip SPEC.md for new registry agents
- Batch source + registry + docs in one commit (unless I explicitly allow)
- Create one agent per vendor demo category
- Port full wizard UIs from `tmp/` — tools only
- Ship 8+ v1 tools

## Example invocation

```
/add-agent

Provider: Firecrawl (FIRECRAWL_API_KEY)
Prototype: tmp/firecrawl-migrator — use map + crawl API routes only
Job: map a website and batch-scrape pages to JSON in workspace
Tools: map_site, batch_scrape, save_results
Out of scope: migrator UI, per-industry agents
Commit each step
E2E template: yes
```

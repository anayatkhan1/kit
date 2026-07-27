# Agent SPEC template

Copy this into `ai/agents/<short>/SPEC.md` during **Phase 1 — Plan** (before any
tool code). The SPEC is the source of truth for scope, providers, and acceptance.
Implementation must match it; PRs are reviewed against it.

`SPEC.md` is **maintainer-only** — do not list it in `registry/registry-agents.ts`
files (users do not install it via CLI).

---

## How to use

1. User provides context via `/add-agent` (providers, prototype, requirements).
2. Agent fills this template → writes `ai/agents/<short>/SPEC.md`.
3. User approves (or requests changes).
4. Agent implements todos from the **Implementation plan** section — one logical
   commit per todo when the user asks for commits.

---

## Template (copy below the line into `ai/agents/<short>/SPEC.md`)

```markdown
# <short>-agent — SPEC

> Status: draft | approved | implemented
> Approved by: @user | date: YYYY-MM-DD

## Job

One sentence: what the user accomplishes with this agent.

## Lane

Web | Files | Channels

## Context (from user)

- **Prototype / reference:** (e.g. `tmp/firecrawl-migrator`, link, or "greenfield")
- **Primary provider:** (e.g. Firecrawl, Telegram Bot API)
- **Secondary providers:** (e.g. Anthropic for model — default in repo)
- **Must-haves:** (non-negotiable v1 behavior)
- **Out of scope:** (explicitly not v1)

## Providers & credentials

| Provider | Purpose | Env var | Notes |
|----------|---------|---------|-------|
| Anthropic | LLM | `ANTHROPIC_API_KEY` | default model in agent.ts |
| … | … | `…` | cost/limits if relevant |

## v1 tools (3–5)

| Tool | Purpose | Provider API | Writes to workspace |
|------|---------|--------------|---------------------|
| `tool_a` | … | … | `data/<short>-agent.local/…` |
| `tool_b` | … | … | … |

### Tool inputs (summary)

- `tool_a`: `field1`, `field2` — …
- `tool_b`: …

## Deferred (extension docs only)

- …
- …

## Overlap check

| Existing agent | Overlap? | Decision |
|----------------|----------|----------|
| web-agent | … | extend / distinct because … |
| extraction-agent | … | … |

## Example user prompts

1. "…"
2. "…"
3. "…"

## Acceptance criteria

- [ ] User can `npx agentcn add <short>-agent` and install all required files
- [ ] Each v1 tool runs with valid env vars (or clear error when missing)
- [ ] Outputs land under `data/<short>-agent.local/` where applicable
- [ ] Docs page + simulated demo replay
- [ ] Tests pass: `pnpm jest ai/agents/<short>`
- [ ] `pnpm agentcn:registry:build` + `pnpm exec nx run @kit/web:build` pass

## Gate checklist

- [ ] Distinct job
- [ ] Real user prompts
- [ ] 15-minute install path
- [ ] Minimal API surface (one primary external provider)
- [ ] Extension story documented
- [ ] Lane fit

## Implementation plan

Each row = one todo = one commit when user requests commit-per-step.

| # | Todo | Commit message (conventional) | Verify before commit |
|---|------|----------------------------|----------------------|
| 0 | Add this SPEC (approved) | `docs(agent): add <short>-agent spec` | User approved |
| 1 | Source: agent, prompt, tools, workspace | `feat(agent): add <short>-agent source` | `pnpm jest` smoke or typecheck |
| 2 | Tests | `test(agent): add <short>-agent tests` | `pnpm jest ai/agents/<short>` |
| 3 | Registry entry + build JSON | `feat(registry): register <short>-agent` | `pnpm agentcn:registry:build` |
| 4 | Docs MDX + demo + meta.json | `docs(agent): add <short>-agent docs and demo` | Demo preview builds |
| 5 | Verify + ship checklist | `chore(agent): verify <short>-agent build` | `pnpm deploy:build` |
| 6 | (Optional) agent-ui-template E2E | `feat(examples): wire <short>-agent in agent-ui-template` | Manual chat smoke |

## Registry sketch

- **name:** `<short>-agent`
- **dependencies:** (npm packages)
- **envVars:** (from table above)
- **categories:** …

## Notes

Open questions, risks, follow-ups after v1.
```

---

## After implementation

- Set `Status: implemented` in SPEC when all acceptance criteria are checked.
- If scope changed during build, update SPEC in the same PR (or a dedicated
  `docs(agent): update <short>-agent spec` commit).

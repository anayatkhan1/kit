Scope and ship a new AgentCN agent — foundation first, not tool sprawl.

## What to do

1. **Read (required, in order)**
   - [`.agents/skills/build-agent/references/agent-foundation-strategy.md`](../../.agents/skills/build-agent/references/agent-foundation-strategy.md) — product gate, lanes, v1 tool budget, anti-patterns
   - [`.agents/skills/build-agent/SKILL.md`](../../.agents/skills/build-agent/SKILL.md) — mechanical checklist (source → registry → docs → demo)

2. **Before writing code**, reply with:
   - **One-sentence job** (what the user actually wants to accomplish)
   - **Lane** (Web | Files | Channels)
   - **v1 tools** (3–5 max; name each and why it is essential)
   - **Deferred** (what we document as extensions, not ship in v1)
   - **Overlap check** — can `web-agent` or `extraction-agent` already do this?

3. **Only if the gate passes**, scaffold `ai/agents/<short>/` and follow the build-agent phase checklist.

4. **Do not**
   - Create one agent per vendor demo category (e.g. seven Firecrawl use cases)
   - Port full wizard UIs from `tmp/` — extract tools only
   - Ship 8+ tools on day one
   - Add a new registry agent when extending an existing one with one tool is enough

## If the user pasted a prototype or link

- Extract the **minimal tool layer** (API calls + schemas + workspace writes)
- Rebuild to AgentCN layout per `references/agent-anatomy.md`
- Put use-case variants in **docs recipes**, not separate agents

## Output when scoping

Use this template unless I asked to implement immediately:

```markdown
## Proposed agent: `<short>-agent`

**Job:** …
**Lane:** …

### v1 tools (N)
1. `tool_name` — …
2. …

### Deferred to extension docs
- …

### Overlap
- vs web-agent: …
- vs extraction-agent: …

### Gate
- [ ] Distinct job
- [ ] Real user prompts
- [ ] 15-min install path
- [ ] Minimal API surface
- [ ] Extension story
- [ ] Lane fit

**Recommendation:** proceed | narrow scope | extend existing agent instead
```

If I say "go ahead" or "implement", follow [build-agent/SKILL.md](../../.agents/skills/build-agent/SKILL.md) end-to-end.

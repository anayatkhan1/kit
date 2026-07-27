<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# AgentCN — docs hub

This repo ships **installable AI agents** (source → registry → `agentcn` CLI → docs/demo).

| Layer | Where |
|-------|--------|
| Agent source | `ai/agents/<short>/` (e.g. `web`, `extraction`) |
| Registry declaration | `registry/registry-agents.ts` |
| Built registry JSON | `apps/web/public/r/<short>-agent.json` |
| Docs + simulated demos | `apps/web/content/docs/agents/`, `apps/web/lib/agent-demos/` |
| Local E2E UI | `examples/agent-ui-template/` |
| CLI package | `packages/agentcn/cli/` |

**To add or update how agents are built and shipped**, edit [`.agents/skills/build-agent/`](.agents/skills/build-agent/) (not this file’s Nx block).

**Before adding any agent:** use `/add-agent` — intake → `ai/agents/<short>/SPEC.md` → approve → build with one commit per todo. Strategy: [agent foundation](.agents/skills/build-agent/references/agent-foundation-strategy.md). Process: [implementation workflow](.agents/skills/build-agent/references/implementation-workflow.md).

Claude Code users: [CLAUDE.md](CLAUDE.md) keeps the Nx block and points here for the full index.

## Index — skills, commands, agents

| Kind | Path | When to use |
|------|------|-------------|
| Skill catalog | [`.agents/skills/README.md`](.agents/skills/README.md) | List of all skills (custom vs Nx-managed) |
| Skill — build agent | [`.agents/skills/build-agent/SKILL.md`](.agents/skills/build-agent/SKILL.md) | New agent, tools, registry, docs, demo |
| **Agent foundation strategy** | [`.agents/skills/build-agent/references/agent-foundation-strategy.md`](.agents/skills/build-agent/references/agent-foundation-strategy.md) | **Read first** — scope v1, lanes, anti-patterns |
| **Agent implementation workflow** | [`.agents/skills/build-agent/references/implementation-workflow.md`](.agents/skills/build-agent/references/implementation-workflow.md) | Intake → SPEC → todos → commits → ship |
| **Agent SPEC template** | [`.agents/skills/build-agent/references/agent-spec-template.md`](.agents/skills/build-agent/references/agent-spec-template.md) | `ai/agents/<short>/SPEC.md` before coding |
| Skill — Nx workspace | [`.agents/skills/nx-workspace/SKILL.md`](.agents/skills/nx-workspace/SKILL.md) | Explore projects/targets; debug Nx failures |
| Skill — Nx generate | [`.agents/skills/nx-generate/SKILL.md`](.agents/skills/nx-generate/SKILL.md) | Scaffold apps/libs |
| Skill — Nx run tasks | [`.agents/skills/nx-run-tasks/SKILL.md`](.agents/skills/nx-run-tasks/SKILL.md) | Run build/test/lint/serve via Nx |
| Skill — Nx plugins | [`.agents/skills/nx-plugins/SKILL.md`](.agents/skills/nx-plugins/SKILL.md) | Discover/add Nx plugins |
| Skill — Nx import | [`.agents/skills/nx-import/SKILL.md`](.agents/skills/nx-import/SKILL.md) | Import repos into the workspace |
| Skill — link packages | [`.agents/skills/link-workspace-packages/SKILL.md`](.agents/skills/link-workspace-packages/SKILL.md) | Wire workspace package deps |
| Skill — monitor CI | [`.agents/skills/monitor-ci/SKILL.md`](.agents/skills/monitor-ci/SKILL.md) | Nx Cloud CI / self-healing |
| Slash command | [`.cursor/commands/add-agent.md`](.cursor/commands/add-agent.md) | `/add-agent` — intake, SPEC, plan, commit-per-todo build |
| Slash command | [`.cursor/commands/pr-description.md`](.cursor/commands/pr-description.md) | `/pr-description` — draft PR title + body |
| Cursor subagent | [`.cursor/agents/ci-monitor-subagent.md`](.cursor/agents/ci-monitor-subagent.md) | Helper used by monitor-ci |
| Claude settings | [`.claude/settings.json`](.claude/settings.json) | Claude Code Nx plugin marketplace |

## Where to edit what

| Goal | Edit |
|------|------|
| **Whether** to add an agent (scope, lanes, v1 tools) | `.agents/skills/build-agent/references/agent-foundation-strategy.md` |
| **Plan** a new agent (SPEC + todos + commits) | `ai/agents/<short>/SPEC.md` via `.agents/skills/build-agent/references/agent-spec-template.md` |
| Shipping a new agent (pattern + checklist) | `.agents/skills/build-agent/` (+ `references/`) |
| New slash command | Add `.cursor/commands/<name>.md` → invoke as `/<name>` |
| New Cursor subagent | Add `.cursor/agents/<name>.md` and link it from this hub |
| Repo map / navigation | This file (`AGENTS.md`), below the Nx markers |
| Nx guidelines | Inside the `<!-- nx configuration -->` block only (auto-updated by Nx) |

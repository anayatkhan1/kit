# Skills catalog

Skills live here as separate `SKILL.md` folders so Cursor / Nx / Claude can discover them. Do not merge them into one file.

The repo hub is [AGENTS.md](../../AGENTS.md).

## Custom (edit these)

| Skill | Path | Use when |
|-------|------|----------|
| **build-agent** | [build-agent/SKILL.md](build-agent/SKILL.md) | Ship an installable agent. Flow: [implementation-workflow.md](build-agent/references/implementation-workflow.md) → `ai/agents/<short>/SPEC.md` → build. Strategy: [agent-foundation-strategy.md](build-agent/references/agent-foundation-strategy.md). |

## Nx-managed (usually leave alone)

Installed / maintained via Nx AI agent config. Prefer updating through Nx plugins rather than hand-editing.

| Skill | Path | Use when |
|-------|------|----------|
| nx-workspace | [nx-workspace/SKILL.md](nx-workspace/SKILL.md) | Explore projects, targets, deps; debug Nx task failures |
| nx-generate | [nx-generate/SKILL.md](nx-generate/SKILL.md) | Scaffold apps/libs / project structure |
| nx-run-tasks | [nx-run-tasks/SKILL.md](nx-run-tasks/SKILL.md) | Run build, test, lint, serve via Nx |
| nx-plugins | [nx-plugins/SKILL.md](nx-plugins/SKILL.md) | Discover or add Nx plugins |
| nx-import | [nx-import/SKILL.md](nx-import/SKILL.md) | Import other repos into this workspace |
| link-workspace-packages | [link-workspace-packages/SKILL.md](link-workspace-packages/SKILL.md) | Wire monorepo package dependencies |
| monitor-ci | [monitor-ci/SKILL.md](monitor-ci/SKILL.md) | Nx Cloud CI status and self-healing (`/monitor-ci`) |

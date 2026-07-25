Write a pull request title and description for the current branch.

## What to do

1. Inspect the branch vs its base (usually `main`):
   - `git status -sb`
   - `git log --oneline <base>...HEAD`
   - `git diff --stat <base>...HEAD`
2. Draft a **title** and **body** only — do not create the PR, push, or commit unless I explicitly ask.
3. Prefer the repo's commit style: conventional, imperative, concise (`feat:`, `fix:`, `docs:`, etc.).

## Title rules

- One line, imperative mood (`add`, not `Added`)
- Prefer `feat(scope): …` when a scope is clear (e.g. `feat(agent): …`)
- Name agents by their distribution id (`extraction-agent`, `web-agent`)
- No trailing period

## Body template

Use this exact structure:

```markdown
## Summary
- <1–3 bullets: why this change exists and what shipped>
- <call out user-facing behavior, CLI/registry impact, or docs if relevant>

## Test plan
- [ ] <concrete verification step>
- [ ] <concrete verification step>
- [ ] <concrete verification step>
```

## Output format

Return **only**:

1. **Title** (plain text, one line)
2. **Body** (markdown, ready to paste into `gh pr create --body`)

If I add extra context after `/pr-description` (e.g. focus areas or reviewers), incorporate it.

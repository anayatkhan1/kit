# AgentCN CLI Release Checklist

Use this flow before publishing a new CLI version and before announcing install commands.

## End-user install (one npm package, any runner)

The CLI package name on npm is **`agentcn`** (unscoped). After it is published, users can install agents with any of these (equivalent for `add` / `list`):

```bash
# pnpm
pnpm dlx agentcn@latest list
pnpm dlx agentcn@latest add web-agent --dry-run --yes

# npm
npx agentcn@latest list
npx agentcn@latest add web-agent --dry-run --yes

# Yarn Berry (v2+)
yarn dlx agentcn@latest list
yarn dlx agentcn@latest add web-agent --dry-run --yes

# Bun
bunx agentcn@latest list
bunx agentcn@latest add web-agent --dry-run --yes
```

### Prerequisites

1. **`agentcn` is published** to the public npm registry (`npm view agentcn` works).
2. **Hosted registry is deployed** — the CLI fetches agent definitions from `https://agentcn.dev/r/*` by default (or `AGENTCN_REGISTRY_URL` / `-r`). Without `/r/index.json` and per-agent JSON (e.g. `web-agent.json`), `add` cannot resolve agents.

Override the registry when testing:

```bash
npx agentcn@latest list -r ./apps/web/public/r
npx agentcn@latest add web-agent --dry-run --yes -r https://agentcn.dev/r
```

## Interactive install flow (`agentcn add`)

The `add` command guides users through a polished step-by-step install:

1. **Project detection** — validates `package.json` and detects Next.js (`next` dependency or `next.config.*`). Warns and asks to continue if Next.js is missing.
2. **Fetch agent** — single spinner: `Fetching web-agent...`
3. **Dependencies** — audits `package.json`; if packages are missing, shows which ones are needed and asks `Install them now?` (default Yes). If all present, shows `Dependencies ready`.
4. **Source files** — writes agent files under `ai/agents/...`. Prompts before overwriting existing files.
5. **Environment variables** — lists required API keys and asks `Add them to .env.example?` (default Yes). Creates or updates `.env.example` only (never writes `.env` / `.env.local`).
6. **Done** — outro with next steps: copy keys to `.env.local`, import agent in chat route, test.

Use `--verbose` to see registry path, per-file breakdown, and tsconfig updates.

### Non-interactive flags

| Flag | Behavior |
| --- | --- |
| `--yes` | Skip prompts; auto-install missing deps; skip file overwrites unless `--overwrite` |
| `--overwrite` | Overwrite conflicting files without prompting |
| `--dry-run` | Show full plan without writes or installs |
| `--verbose` | Per-file logging and package manager output |

Example CI / preview:

```bash
pnpm dlx agentcn@latest add web-agent --dry-run --yes
```

## Registry source of truth

- Production registry URL: **`https://agentcn.dev/r/*`**.
- Build output in this repo: **`kit/apps/web/public/r`** (generated; do not edit by hand).
- Full deploy bundle should run registry generation before the web build:
  - `pnpm deploy:build` (runs `agentcn:registry:build` then `web:build`).

## Publishing to npm (maintainers)

Publishing runs in **GitHub Actions** after you push a release tag. Locally you only version, changelog, and tag — npm upload is automated.

See also: [Nx Publish in CI/CD](https://nx.dev/docs/guides/nx-release/publish-in-ci-cd).

### GitHub Actions secrets (one-time setup)

Configure in GitHub → **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
| --- | --- |
| `NPM_ACCESS_TOKEN` | Granular npm token with **read/write** on `agentcn` |

**Create the npm token:**

1. [npm Access Tokens](https://www.npmjs.com/settings/tokens) → **Generate New Token** → **Granular Access Token**
2. Packages: select **`agentcn`** with **Read and write**
3. Enable **Bypass 2FA for automation** (CI cannot use `--otp`)
4. Copy the token and add it as repository secret **`NPM_ACCESS_TOKEN`**

Never commit tokens. Rotate any token that was exposed in chat or logs.

**Optional — GitHub Releases from local `nx release`:**

`nx.json` sets `createRelease: "github"`. If changelog step fails with `401 Requires authentication`, either:

- Run `gh auth login` before releasing locally, or
- Add a `GITHUB_TOKEN` secret (e.g. `gh auth token`), or
- Set `"createRelease": false` in `nx.json` and create releases manually from the tag

### CI workflows

| Workflow | Trigger | What it does |
| --- | --- | --- |
| [`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml) | PR and push to `main` | `pnpm exec nx run agentcn:build` + `agentcn:test` |
| [`.github/workflows/publish.yml`](../../../.github/workflows/publish.yml) | Push tag `agentcn@*` | Test, then `nx release publish` to npm |

**Manual publish dry-run** (no upload): GitHub → Actions → **Publish** → **Run workflow** → enable **dry-run**.

### Baseline git tag (required once)

Nx release uses git tags like `agentcn@0.1.1` to know the **last released version**. If you bump `package.json` by hand without tagging, the next `pnpm release` may double-bump (e.g. 0.2.0 → 0.3.0) and fail on changelog.

After the version on npm, tag that commit:

```bash
# Example: npm currently has 0.1.1 — tag the commit where package.json was 0.1.1
git tag agentcn@0.1.1 421b96f
git push origin agentcn@0.1.1
```

Check tags: `git tag -l 'agentcn@*'`

### Release flow (version locally, publish in CI)

```bash
# 1. Preview version bump, changelog, and tag (no publish)
pnpm release --dry-run --skip-publish

# 2. Version + changelog + git tag (skips npm publish)
pnpm release:skip-publish

# 3. Push commit and tag — CI publishes to npm on tag push
git push && git push --tags

# 4. Verify after the Publish workflow completes
npm view agentcn version
npm view agentcn dist-tags.latest
pnpm agentcn:registry:verify-live
```

**What CI does on tag `agentcn@X.Y.Z`:**

1. Install dependencies
2. Run `agentcn:test`
3. Run `pnpm exec nx release publish --projects=agentcn` with npm provenance
4. If Nx + pnpm publish fails (known JSON parse issue), fall back to `npm publish` from `packages/agentcn/cli`

`npm publish --dry-run` can still be run from `packages/agentcn/cli` to validate the tarball without uploading.

### Legacy manual publish (emergency only)

If CI is broken and you need an immediate hotfix:

```bash
cd packages/agentcn/cli
pnpm test
npm publish --access public --otp=XXXXXX   # 6-digit TOTP if not using automation token
```

Prefer fixing CI over manual publishes.

## Post-publish & deploy verification gate

Do **not** announce the multi-runner install flow until **both** are true:

| Check | Command / expectation |
| --- | --- |
| npm package resolves | `npm view agentcn` shows the new version |
| Hosted registry is complete | `pnpm agentcn:registry:verify-live` exits **0** |

The live check hits `https://agentcn.dev/r/index.json` (must list **`web-agent`**) and `https://agentcn.dev/r/web-agent.json` (must return **200**). To confirm the **repo build output** only (offline), from `kit/`:

`bash scripts/verify-agentcn-registry-live.sh "file://$PWD/apps/web/public/r"`

If the production check fails, rebuild and redeploy:

```bash
pnpm agentcn:registry:build
pnpm deploy:build
# then deploy the built web app / static assets so production serves updated apps/web/public/r/*
```

## Changelog & versioning (Nx release)

The `agentcn` package uses [Nx release](https://nx.dev/features/manage-releases) with conventional commits. Changelog entries include commit links, release dates, and a **Thank You** section for authors.

Configuration lives in [`nx.json`](../../../nx.json) at the repo root (`projectChangelogs.renderOptions`).

From the workspace root:

```bash
# Preview version bump, CHANGELOG.md update, and git tag (no npm publish)
pnpm release --dry-run --skip-publish

# Version + changelog + tag locally; CI publishes on tag push
pnpm release:skip-publish

# Individual steps
pnpm release:version
pnpm release:changelog
# Publish runs in CI on tag push, or manually:
pnpm release:publish
```

Generated changelog file: **`packages/agentcn/cli/CHANGELOG.md`**. Tags use `{projectName}@{version}` (e.g. `agentcn@0.1.2`).

Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, etc.) so Nx groups entries under **Features**, **Fixes**, and related sections.

## Release checklist (ordered)

1. Build registry artifacts from repo root: `pnpm agentcn:registry:build`
2. Build and test the CLI: `pnpm --filter agentcn build` and `pnpm --filter agentcn test`
3. Tarball smoke: `pnpm --filter agentcn pack:smoke`
4. Multi-runner smoke (local tarball + local registry path): `pnpm agentcn:runner-matrix-smoke`  
   Requires optional tools for full matrix: **corepack/yarn** (Yarn Berry), **bun** (Bun). npm and pnpm use the repo toolchain.
5. Version, changelog, and tag with Nx (CI publishes on tag push): `pnpm release:skip-publish` (preview with `--dry-run` first)
6. `pnpm agentcn:registry:verify-live` against production after deploy

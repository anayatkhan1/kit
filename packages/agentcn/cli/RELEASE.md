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

## Registry source of truth

- Production registry URL: **`https://agentcn.dev/r/*`**.
- Build output in this repo: **`kit/apps/web/public/r`** (generated; do not edit by hand).
- Full deploy bundle should run registry generation before the web build:
  - `pnpm deploy:build` (runs `agentcn:registry:build` then `web:build`).

## Publishing to npm (maintainers)

1. Ensure you are logged in: `npm whoami` (if not, `npm login`).
2. From the workspace root:
   - `pnpm --filter agentcn publish --access public`
3. Confirm:
   - `npm view agentcn version`
   - `npm view agentcn dist-tags.latest`

`npm publish --dry-run` can be run from `packages/agentcn/cli` to validate the tarball without uploading.

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
# Preview version bump, CHANGELOG.md update, git tag, and GitHub release
pnpm release --dry-run --skip-publish

# Run the full release (version + changelog + tag + publish prompt)
pnpm release

# Individual steps
pnpm release:version
pnpm release:changelog
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
5. Version, changelog, tag, and publish with Nx: `pnpm release` (or `--dry-run --skip-publish` first)
6. `pnpm agentcn:registry:verify-live` against production after deploy

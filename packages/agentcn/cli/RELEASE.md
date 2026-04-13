# AgentCN CLI Release Checklist

Use this flow before publishing a new CLI version.

## Registry source of truth

- Production registry endpoint is `https://agentcn.dev/r/*`.
- `/r/*` is owned by the AgentCN registry build output at `kit/apps/web/public/r`.
- Build order for deployments must run AgentCN registry generation first:
  - `pnpm deploy:build`

## Registry env configuration

- Registry URL config is a CLI concern and should be set in root shell/CI environment.
- Do not add `AGENTCN_REGISTRY_URL` as a web runtime env unless web code explicitly needs it.
- Recommended values:
  - Local testing before deploy: `AGENTCN_REGISTRY_URL=http://localhost:3000/r`
  - Production/release checks: `AGENTCN_REGISTRY_URL=https://agentcn.dev/r`

1. Build registry artifacts from repo root:
   - `pnpm agentcn:registry:build`
2. Build and test the CLI package:
   - `pnpm --filter @kit/agentcn build`
   - `pnpm --filter @kit/agentcn test`
3. Create a tarball smoke package:
   - `pnpm --filter @kit/agentcn pack:smoke`
4. Install tarball in a clean test project and run:
   - `agentcn list -r <registry-path-or-url>`
   - `agentcn add file-agent --dry-run -r <registry-path-or-url>`
5. Verify generated files, tsconfig aliases, and env updates.
6. Publish:
   - `pnpm --filter @kit/agentcn publish --access public`

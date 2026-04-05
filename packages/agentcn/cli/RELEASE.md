# AgentCN CLI Release Checklist

Use this flow before publishing a new CLI version.

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

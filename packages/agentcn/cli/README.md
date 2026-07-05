# agentcn

A CLI for adding AI agents to your project.

Install reusable, editable agent source — prompts, tools, and runtime logic — directly into your Next.js app. You own the code.

## add

Use the `add` command to install an agent into your project.

The `add` command fetches the agent from the [AgentCN registry](https://agentcn.dev/r), installs missing dependencies, writes source files under `ai/agents/`, updates `.env.example`, and configures TypeScript path aliases.

```bash
npx agentcn@latest add web-agent
```

### Example

```bash
pnpm dlx agentcn@latest add web-agent
```

Preview changes without writing files:

```bash
npx agentcn@latest add web-agent --dry-run --yes
```

### Options

- `-r, --registry <path|url>` — Registry path or URL (default: `https://agentcn.dev/r`)
- `--dry-run` — Preview the install plan
- `--yes` — Non-interactive mode
- `--overwrite` — Overwrite existing files
- `--verbose` — Verbose output
- `--cwd <path>` — Target project directory

## list

Use the `list` command to view available agents in the registry.

```bash
npx agentcn@latest list
```

## info

Use the `info` command to show details for a specific agent (dependencies, env vars, files).

```bash
npx agentcn@latest info web-agent
```

## After install

1. Copy required keys from `.env.example` to `.env.local`
2. Import the agent in your chat API route:

```ts
import { webAgent } from "@/agents/web";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = webAgent(messages);
  return result.toUIMessageStreamResponse();
}
```

## Documentation

Visit [https://agentcn.dev/docs](https://agentcn.dev/docs) to view the documentation.

Registry: [https://agentcn.dev/r](https://agentcn.dev/r)

## License

Licensed under the MIT license. See [LICENSE](LICENSE).

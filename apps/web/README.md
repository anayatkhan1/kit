# AgentCN — Installable AI Agents Kit

![GitHub Repo stars](https://img.shields.io/github/stars/anayatkhan1/kit?style=social)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Open source kit for **installable AI agents**. Use the CLI to pull agent source into your project, run agents locally, and customize prompts and tools in your own codebase.

This package (`apps/web`) is the AgentCN marketing site, documentation, and agent registry host at [agentcn.dev](https://agentcn.dev).

---

## Features

- **CLI** — Install agents from the registry into your repo
- **Agent registry** — Hosted JSON manifests at `/r`
- **Docs** — Guides for setup, agents, and customization
- **Starter templates** — Open source project templates to ship faster

---

## Documentation

Full docs: [agentcn.dev/docs](https://agentcn.dev/docs)

---

## Local development

```bash
cp .env.example .env
pnpm nx run @kit/web:dev
```

---

## Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add new feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) in the monorepo root for details.

---

## Community

Questions or feedback? Join [Discord](https://discord.gg/SV2y7vz6Es) or follow [@agentcnkit](https://x.com/agentcnkit) on X.

---

## License

AgentCN is licensed under the [MIT License](../../LICENSE) with an additional clause restricting resale of unmodified or minimally modified versions.

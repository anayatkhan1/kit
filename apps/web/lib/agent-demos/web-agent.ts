import type { AgentDemoConfig } from "./types"

export const webAgentDemo: AgentDemoConfig = {
  agentId: "web-agent",
  label: "Web Agent",
  description:
    "Uses web search, deep research, browser automation, and websets.",
  defaultScenarioId: "starter",
  scenarios: [
    {
      id: "starter",
      prompt:
        "Find top AI coding agents launched this month with concise citations.",
      assistantParts: [
        {
          type: "tool",
          tool: "web_search",
          input: {
            query: "AI coding agents launched July 2026",
          },
        },
        {
          type: "tool",
          tool: "answer_question",
          input: {
            question:
              "What are the top AI coding agents launched this month?",
          },
        },
        {
          type: "text",
          text: `Here are notable AI coding agents launched recently:

• **Cursor Agent** — IDE-native agent with multi-file edits and terminal access. [cursor.com](https://cursor.com)

• **Devin 2.0** — Autonomous software engineer for end-to-end task completion. [cognition.ai](https://cognition.ai)

• **Windsurf Cascade** — Flow-based coding agent with deep repo context. [windsurf.com](https://windsurf.com)

• **GitHub Copilot Workspace** — Issue-to-PR agent inside GitHub. [github.com/features/copilot](https://github.com/features/copilot)

• **Replit Agent v2** — Full-stack app builder from natural language. [replit.com](https://replit.com)

These agents emphasize autonomous coding workflows, tool use, and tighter IDE integration.`,
        },
      ],
    },
  ],
}

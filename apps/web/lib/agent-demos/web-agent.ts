import type { AgentDemoConfig } from "./types"

export const webAgentDemo: AgentDemoConfig = {
  agentId: "web-agent",
  label: "Web Agent",
  description:
    "Uses web search, deep research, browser automation, and websets.",
  defaultScenarioId: "search",
  scenarios: [
    {
      id: "search",
      label: "Search & cite",
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

These agents emphasize autonomous coding workflows, tool use, and tighter IDE integration.`,
        },
      ],
    },
    {
      id: "research",
      label: "Deep research",
      prompt:
        "Research how EU AI Act enforcement changed for foundation model providers in 2026.",
      assistantParts: [
        {
          type: "tool",
          tool: "deep_research",
          input: {
            task: "EU AI Act foundation model enforcement changes 2026",
          },
        },
        {
          type: "text",
          text: `Summary of 2026 enforcement shifts for foundation model providers:

• **Documentation duties** — Providers must maintain technical docs and training-data summaries for high-risk downstream use.

• **Systemic risk tier** — Models above compute thresholds face additional incident reporting and red-team audit expectations.

• **Market surveillance** — National authorities gained powers to request model evaluations before public deployment in sensitive sectors.

• **Open-weight carve-outs** — Fine-tuned releases still inherit obligations when deployed in high-risk contexts.

Sources: EU AI Office guidance, Digital Markets compliance briefs, and provider policy updates from Q1–Q2 2026.`,
        },
      ],
    },
    {
      id: "browser",
      label: "Browser",
      prompt:
        "Open anthropic.com/pricing and summarize the current Claude plan tiers.",
      assistantParts: [
        {
          type: "tool",
          tool: "use_browser",
          input: {
            task: "Navigate anthropic.com/pricing and extract plan tiers",
          },
        },
        {
          type: "browser_view",
          url: "https://www.anthropic.com/pricing",
          pageTitle: "Claude pricing",
          provider: "Anchor Browser",
          navigationSteps: [
            "Opening browser session…",
            "Navigating to anthropic.com/pricing…",
            "Waiting for page load…",
            "Extracting plan tiers…",
          ],
          pageContent: [
            { heading: "Free", detail: "Limited Claude access with usage caps" },
            { heading: "Pro", detail: "Higher limits and priority access" },
            { heading: "Team", detail: "Shared workspace and admin controls" },
            { heading: "Enterprise", detail: "SSO, custom terms, dedicated support" },
          ],
        },
        {
          type: "text",
          text: `Summary: Claude offers **Free**, **Pro**, **Team**, and **Enterprise** tiers. API usage is billed separately per million tokens on the same page.`,
        },
      ],
    },
    {
      id: "webset",
      label: "Webset",
      prompt:
        "Create a webset of YC W26 AI infrastructure startups with founders and funding.",
      assistantParts: [
        {
          type: "tool",
          tool: "create_webset",
          input: {
            task: "YC W26 AI infrastructure startups with founders and funding",
          },
        },
        {
          type: "webset_view",
          title: "YC W26 · AI infrastructure startups",
          provider: "Exa Websets",
          entityCount: 12,
          columns: ["Company", "Founders", "Round", "Category"],
          rows: [
            ["LatticeFlow AI", "Ana Ruiz", "$4.2M Seed", "Observability"],
            ["Pipestack", "Sam Cho, Priya N.", "$2.1M Pre-seed", "Inference"],
            ["VaultML", "Marco Bellini", "$3.8M Seed", "On-prem runtime"],
            ["ContextForge", "Lee & Kim", "$5.0M Seed", "Agent memory"],
          ],
        },
        {
          type: "text",
          text: `Webset job completed with **12 entities** and enrichments for founders, funding, and product category. Export as CSV or JSON from the artifact file in a real run.`,
        },
      ],
    },
  ],
}

import { Registry } from "shadcn/registry"

export const templates: Registry["items"] = [
  {
    name: "agentkit-starter",
    type: "registry:page",
    description:
      "Production-ready starter template for building AI agents with web search capabilities.",
    files: [
      {
        path: "content/templates/agentkit-starter.mdx",
        type: "registry:page",
        target: "content/templates/agentkit-starter.mdx",
      },
    ],
    categories: ["ai"],
    meta: {
      title: "AgentKit",
      preview: "https://agentkitt.xyz",
      tags: ["AI", "Web Search", "Chat", "Next.js", "Open Source"],
      image: "/templates/agentkit-starter.png",
    },
  },
]

"use client"

import Link from "next/link"

import { CodeBlockCommand } from "@/components/code-block-command"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"

const demoBaseUrl =
  process.env.NEXT_PUBLIC_AGENT_DEMO_URL ?? "http://localhost:3001"

export function AgentDemoPreview({
  agentId = "web-agent",
  align = "center",
  replayable = true,
}: {
  agentId?: string
  align?: "center" | "start" | "end"
  replayable?: boolean
}) {
  const embedUrl = `${demoBaseUrl.replace(/\/$/, "")}/embed/${agentId}`

  return (
    <ComponentPreviewTabs
      align={align}
      replayable={replayable}
      component={
        <iframe
          src={embedUrl}
          className="size-full rounded-md border-0 bg-background"
          title="Web Agent live preview"
          allow="clipboard-write"
        />
      }
      source={
        <div className="space-y-4 p-4">
          <p className="text-muted-foreground text-sm">
            Install the agent in your project, then configure environment
            variables in the{" "}
            <Link href="#installation" className="text-foreground underline">
              Installation
            </Link>{" "}
            section below.
          </p>
          <CodeBlockCommand
            __npm__="npx agentcn@latest add web-agent"
            __yarn__="yarn dlx agentcn@latest add web-agent"
            __pnpm__="pnpm dlx agentcn@latest add web-agent"
            __bun__="bunx agentcn@latest add web-agent"
          />
          <p className="text-muted-foreground text-sm">
            Run the demo app locally (requires API keys in{" "}
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.1rem] font-mono text-sm">
              .env.local
            </code>
            ):
          </p>
          <figure className="overflow-hidden rounded-lg">
            <pre className="bg-code border-border/70 max-w-full min-w-0 overflow-x-auto rounded-[0.375rem] border px-4 py-3.5">
              <code className="relative font-mono text-sm leading-none whitespace-pre">
                {`cd examples/agent-ui-template
pnpm install
pnpm dev:embed`}
              </code>
            </pre>
          </figure>
        </div>
      }
    />
  )
}

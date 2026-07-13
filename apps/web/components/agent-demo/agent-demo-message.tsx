"use client"

import { Bot, User } from "lucide-react"

import type { DemoMessagePart } from "@/lib/agent-demos/types"
import {
  getDemoBrowserViews,
  getDemoText,
  getDemoToolParts,
  getDemoWebsetViews,
} from "@/lib/agent-demos/tool-labels"
import { cn } from "@/lib/utils"
import { AgentDemoBrowserPanel } from "@/components/agent-demo/agent-demo-browser-panel"
import { AgentDemoFormattedText } from "@/components/agent-demo/agent-demo-formatted-text"
import {
  AgentDemoToolSteps,
  type DemoToolStatus,
} from "@/components/agent-demo/agent-demo-tool-steps"
import { AgentDemoWebsetTable } from "@/components/agent-demo/agent-demo-webset-table"

export function AgentDemoMessage({
  role,
  parts,
  toolStatuses,
  animateIn = false,
  isReplaying = false,
}: {
  role: "user" | "assistant"
  parts: DemoMessagePart[] | string
  toolStatuses?: DemoToolStatus[]
  animateIn?: boolean
  isReplaying?: boolean
}) {
  const isUser = role === "user"
  const text = typeof parts === "string" ? parts : getDemoText(parts)
  const toolParts = typeof parts === "string" ? [] : getDemoToolParts(parts)
  const browserViews = typeof parts === "string" ? [] : getDemoBrowserViews(parts)
  const websetViews = typeof parts === "string" ? [] : getDemoWebsetViews(parts)
  const showText = Boolean(text)
  const hasRichViews = browserViews.length > 0 || websetViews.length > 0

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        animateIn && "animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1.5",
          isUser ? "max-w-[90%] items-end" : "w-full max-w-full items-start"
        )}
      >
        <div className="flex items-center gap-2 px-1">
          <div
            className={cn(
              "flex size-5 items-center justify-center rounded-full border shadow-sm",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background"
            )}
          >
            {isUser ? <User className="size-3" /> : <Bot className="size-3" />}
          </div>
          <span className="text-muted-foreground text-xs font-medium">
            {isUser ? "You" : "AI Agent"}
          </span>
        </div>

        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground max-w-full rounded-tr-sm"
              : "bg-card text-foreground border-border w-full rounded-tl-sm border"
          )}
        >
          {isUser ? (
            <p className="leading-relaxed">{text}</p>
          ) : (
            <div className="space-y-3">
              {toolParts.length > 0 ? (
                <AgentDemoToolSteps tools={toolParts} statuses={toolStatuses} />
              ) : null}

              {browserViews.map((view) => (
                <AgentDemoBrowserPanel
                  key={view.url}
                  view={view}
                  isReplaying={isReplaying}
                />
              ))}

              {websetViews.map((view) => (
                <AgentDemoWebsetTable
                  key={view.title}
                  view={view}
                  isReplaying={isReplaying}
                />
              ))}

              {showText ? (
                <div
                  className={cn(
                    (toolParts.length > 0 || hasRichViews) &&
                      "border-border border-t pt-3",
                    animateIn && "animate-in fade-in-0 duration-500"
                  )}
                >
                  <AgentDemoFormattedText text={text} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { Bot, User } from "lucide-react"

import type { DemoMessagePart } from "@/lib/agent-demos/types"
import {
  getDemoText,
  getDemoToolParts,
} from "@/lib/agent-demos/tool-labels"
import { cn } from "@/lib/utils"
import { AgentDemoFormattedText } from "@/components/agent-demo/agent-demo-formatted-text"
import {
  AgentDemoToolSteps,
  type DemoToolStatus,
} from "@/components/agent-demo/agent-demo-tool-steps"

export function AgentDemoMessage({
  role,
  parts,
  toolStatuses,
  animateIn = false,
}: {
  role: "user" | "assistant"
  parts: DemoMessagePart[] | string
  toolStatuses?: DemoToolStatus[]
  animateIn?: boolean
}) {
  const isUser = role === "user"
  const text = typeof parts === "string" ? parts : getDemoText(parts)
  const toolParts = typeof parts === "string" ? [] : getDemoToolParts(parts)
  const showText = Boolean(text)
  const showToolsOnly = !showText && toolParts.length > 0

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
          "flex max-w-[90%] flex-col gap-1.5",
          isUser ? "items-end" : "items-start"
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
            "relative w-full rounded-2xl px-4 py-3 text-sm shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card text-foreground border-border rounded-tl-sm border"
          )}
        >
          {isUser ? (
            <p className="leading-relaxed">{text}</p>
          ) : (
            <div className="space-y-3">
              {toolParts.length > 0 ? (
                <AgentDemoToolSteps tools={toolParts} statuses={toolStatuses} />
              ) : null}

              {showText ? (
                <div
                  className={cn(
                    toolParts.length > 0 && "border-border border-t pt-3",
                    animateIn && "animate-in fade-in-0 duration-500"
                  )}
                >
                  <AgentDemoFormattedText text={text} />
                </div>
              ) : showToolsOnly ? null : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

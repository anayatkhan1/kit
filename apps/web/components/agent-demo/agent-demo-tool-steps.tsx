"use client"

import { Check, Loader2 } from "lucide-react"

import type { DemoToolPart } from "@/lib/agent-demos/types"
import { getDemoToolLabel } from "@/lib/agent-demos/tool-labels"
import { cn } from "@/lib/utils"

export type DemoToolStatus = "pending" | "running" | "done"

export function AgentDemoToolSteps({
  tools,
  statuses,
}: {
  tools: DemoToolPart[]
  statuses?: DemoToolStatus[]
}) {
  if (tools.length === 0) return null

  return (
    <div className="space-y-2">
      {tools.map((tool, index) => {
        const status = statuses?.[index] ?? "done"
        const isRunning = status === "running"
        const isPending = status === "pending"

        return (
          <div
            key={`${tool.tool}-${index}`}
            className={cn(
              "bg-muted/40 flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs transition-all duration-300",
              isRunning && "border-primary/30 bg-primary/5",
              isPending && "opacity-40",
              status === "done" && "border-border/60"
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full",
                isRunning && "text-primary",
                status === "done" && "text-emerald-600 dark:text-emerald-400",
                isPending && "text-muted-foreground"
              )}
            >
              {isRunning ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : status === "done" ? (
                <Check className="size-3.5" />
              ) : (
                <span className="bg-muted-foreground/40 size-1.5 rounded-full" />
              )}
            </span>
            <span
              className={cn(
                "text-foreground/90 min-w-0 flex-1 truncate",
                isRunning && "text-foreground"
              )}
            >
              {getDemoToolLabel(tool)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

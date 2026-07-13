"use client"

import { Bot } from "lucide-react"

import { cn } from "@/lib/utils"

export function AgentDemoThinking({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full justify-start", className)}>
      <div className="flex max-w-[85%] flex-col gap-1.5">
        <div className="flex items-center gap-2 px-1">
          <div className="bg-foreground text-background flex size-5 items-center justify-center rounded-full border shadow-sm">
            <Bot className="size-3" />
          </div>
          <span className="text-muted-foreground text-xs font-medium">
            AI Agent
          </span>
        </div>

        <div className="bg-card border-border rounded-2xl rounded-tl-sm border px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="bg-muted-foreground/70 size-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
            <span className="bg-muted-foreground/70 size-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
            <span className="bg-muted-foreground/70 size-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
            <span className="text-muted-foreground ml-2 text-xs">
              Running tools…
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

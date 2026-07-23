"use client"

import * as React from "react"
import { Check, Copy, Terminal } from "lucide-react"

import { cn } from "@/lib/utils"

const defaultCommand = "npx agentcn@latest add web-agent"

export function InstallCommand({
  className,
  variant = "default",
  command = defaultCommand,
  copyLabel = "Copy command",
}: {
  className?: string
  variant?: "default" | "pill"
  command?: string
  copyLabel?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<number | undefined>(undefined)

  React.useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current)
    },
    []
  )

  async function copyCommand() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1800)
  }

  const isPill = variant === "pill"

  return (
    <button
      type="button"
      onClick={copyCommand}
      className={cn(
        "group min-w-0 text-left text-muted-foreground transition-all duration-300 hover:text-foreground",
        isPill
          ? "inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-1.5 hover:border-border hover:bg-foreground/4"
          : "flex items-center gap-2.5 rounded-lg",
        className
      )}
      aria-label={copied ? "Command copied" : copyLabel}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-foreground/5 ring-1 ring-black/5 dark:ring-white/10",
          isPill ? "size-6" : "size-7"
        )}
      >
        <Terminal className={cn(isPill ? "size-3" : "size-3.5")} />
      </span>
      <code
        className={cn(
          "truncate font-mono tracking-tight",
          isPill ? "text-[11px] sm:text-xs" : "text-xs md:text-[13px]"
        )}
      >
        {command}
      </code>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md opacity-60 transition-opacity group-hover:opacity-100",
          isPill ? "size-6" : "size-7"
        )}
      >
        {copied ? (
          <Check className={cn("text-emerald-500", isPill ? "size-3" : "size-3.5")} />
        ) : (
          <Copy className={cn(isPill ? "size-3" : "size-3.5")} />
        )}
      </span>
    </button>
  )
}

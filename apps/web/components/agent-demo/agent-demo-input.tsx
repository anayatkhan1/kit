"use client"

import { ArrowUp, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function AgentDemoInput({
  value,
  onChange,
  onSubmit,
  disabled,
  hint,
  isLoading,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  hint?: string
  isLoading?: boolean
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="shrink-0 space-y-2">
      {hint ? (
        <p className="text-muted-foreground rounded-md bg-amber-500/10 px-2.5 py-2 text-xs text-amber-800 dark:text-amber-200">
          {hint}
        </p>
      ) : (
        <p className="text-muted-foreground text-xs">
          Press send to replay the example with tool steps.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "border-border bg-card flex flex-col gap-2 rounded-lg border p-2 shadow-sm transition-opacity",
            isLoading && "opacity-80"
          )}
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ask the web agent to search, research, or browse..."
            className="min-h-[56px] resize-none border-0 bg-transparent p-1.5 text-sm shadow-none focus-visible:ring-0"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSubmit()
              }
            }}
          />
          <div className="flex items-center justify-between gap-2">
            {isLoading ? (
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Loader2 className="size-3 animate-spin" />
                Simulating agent…
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">
                Enter to send
              </span>
            )}
            <Button
              type="submit"
              size="icon"
              className="size-8 rounded-full"
              disabled={disabled || value.trim().length === 0}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

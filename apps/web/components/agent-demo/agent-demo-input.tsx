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
    <div className="shrink-0 space-y-1.5">
      {hint ? (
        <p className="text-muted-foreground rounded-md bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-800 dark:text-amber-200">
          {hint}
        </p>
      ) : null}
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "border-border bg-card flex items-end gap-1.5 rounded-lg border px-2 py-1.5 shadow-sm transition-opacity",
            isLoading && "opacity-80"
          )}
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Send the example prompt…"
            rows={2}
            className="max-h-14 min-h-9 flex-1 resize-none border-0 bg-transparent p-1 text-sm leading-snug shadow-none focus-visible:ring-0"
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSubmit()
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="size-7 shrink-0 rounded-full"
            disabled={disabled || value.trim().length === 0}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <ArrowUp className="size-3.5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

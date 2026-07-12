"use client"

import * as React from "react"
import { Globe, Loader2, Lock } from "lucide-react"

import type { DemoBrowserViewPart } from "@/lib/agent-demos/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function AgentDemoBrowserPanel({
  view,
  isReplaying = false,
}: {
  view: DemoBrowserViewPart
  isReplaying?: boolean
}) {
  const [stepIndex, setStepIndex] = React.useState(
    isReplaying ? -1 : view.navigationSteps.length - 1
  )
  const [showContent, setShowContent] = React.useState(!isReplaying)

  React.useEffect(() => {
    if (!isReplaying) {
      setStepIndex(view.navigationSteps.length - 1)
      setShowContent(true)
      return
    }

    setStepIndex(-1)
    setShowContent(false)

    const timers: number[] = []
    view.navigationSteps.forEach((_step, index) => {
      timers.push(
        window.setTimeout(() => {
          setStepIndex(index)
        }, (index + 1) * 700)
      )
    })

    timers.push(
      window.setTimeout(() => {
        setShowContent(true)
      }, view.navigationSteps.length * 700 + 400)
    )

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [isReplaying, view.navigationSteps])

  const isNavigating = isReplaying && !showContent
  const currentStep =
    stepIndex >= 0 ? view.navigationSteps[stepIndex] : "Starting browser session…"

  return (
    <div className="space-y-2">
      <div className="border-border overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border bg-muted/50 flex items-center gap-2 border-b px-3 py-2">
          <span className="size-2 rounded-full bg-red-500/80" />
          <span className="size-2 rounded-full bg-yellow-500/80" />
          <span className="size-2 rounded-full bg-green-500/80" />
          <div className="bg-background text-muted-foreground ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
            <Lock className="size-3 shrink-0" />
            <span className="truncate">{view.url}</span>
          </div>
        </div>

        <div className="bg-muted/20 flex items-center justify-between gap-2 border-b px-3 py-1.5">
          <div className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
            {isNavigating ? (
              <Loader2 className="text-primary size-3 shrink-0 animate-spin" />
            ) : (
              <Globe className="size-3 shrink-0" />
            )}
            <span className="truncate">{currentStep}</span>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
            {view.provider}
          </Badge>
        </div>

        <div
          className={cn(
            "bg-background space-y-3 p-4 transition-opacity duration-500",
            showContent ? "opacity-100" : "opacity-40"
          )}
        >
          <div>
            <h4 className="text-foreground text-sm font-semibold">
              {view.pageTitle}
            </h4>
            <p className="text-muted-foreground text-xs">{view.url}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {view.pageContent.map((item) => (
              <div
                key={item.heading}
                className="border-border bg-card rounded-md border p-2.5"
              >
                <p className="text-foreground text-xs font-medium">
                  {item.heading}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-[11px] leading-relaxed">
        Simulated preview. Real agent uses{" "}
        <span className="text-foreground font-medium">{view.provider}</span> to
        open live browser sessions and return results + artifacts.
      </p>
    </div>
  )
}

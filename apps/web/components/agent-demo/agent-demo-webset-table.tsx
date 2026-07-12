"use client"

import * as React from "react"
import { Loader2, Table2 } from "lucide-react"

import type { DemoWebsetViewPart } from "@/lib/agent-demos/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function AgentDemoWebsetTable({
  view,
  isReplaying = false,
}: {
  view: DemoWebsetViewPart
  isReplaying?: boolean
}) {
  const [visibleRows, setVisibleRows] = React.useState(
    isReplaying ? 0 : view.rows.length
  )
  const [isBuilding, setIsBuilding] = React.useState(isReplaying)

  React.useEffect(() => {
    if (!isReplaying) {
      setVisibleRows(view.rows.length)
      setIsBuilding(false)
      return
    }

    setVisibleRows(0)
    setIsBuilding(true)

    const timers: number[] = []
    view.rows.forEach((_row, index) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleRows(index + 1)
        }, (index + 1) * 450)
      )
    })

    timers.push(
      window.setTimeout(() => {
        setIsBuilding(false)
      }, view.rows.length * 450 + 300)
    )

    return () => {
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [isReplaying, view.rows])

  return (
    <div className="space-y-2">
      <div className="border-border overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border bg-muted/40 flex items-center justify-between gap-2 border-b px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <Table2 className="text-muted-foreground size-3.5 shrink-0" />
            <span className="text-foreground truncate text-xs font-medium">
              {view.title}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {isBuilding ? (
              <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                <Loader2 className="size-3 animate-spin" />
                Building…
              </span>
            ) : (
              <Badge variant="secondary" className="text-[10px] font-normal">
                {view.entityCount} entities
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] font-normal">
              {view.provider}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-xs">
            <thead>
              <tr className="border-border bg-muted/30 border-b">
                {view.columns.map((column) => (
                  <th
                    key={column}
                    className="text-muted-foreground px-3 py-2 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: view.rows.length }).map((_, rowIndex) => {
                const row = view.rows[rowIndex]
                const isVisible = rowIndex < visibleRows

                if (!isVisible) {
                  return (
                    <tr key={`sk-${rowIndex}`} className="border-border border-b">
                      {view.columns.map((column) => (
                        <td key={column} className="px-3 py-2.5">
                          <Skeleton className="h-3 w-full max-w-24" />
                        </td>
                      ))}
                    </tr>
                  )
                }

                return (
                  <tr
                    key={row.join("-")}
                    className={cn(
                      "border-border border-b last:border-0",
                      isReplaying && "animate-in fade-in-0 duration-300"
                    )}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className={cn(
                          "px-3 py-2.5",
                          cellIndex === 0 && "text-foreground font-medium"
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-muted-foreground text-[11px] leading-relaxed">
        Simulated preview. Real agent uses{" "}
        <span className="text-foreground font-medium">{view.provider}</span>{" "}
        (async job) and saves results to artifact files — table UI is demo-only
        for now.
      </p>
    </div>
  )
}

"use client"

import type { AgentDemoScenario } from "@/lib/agent-demos/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function AgentDemoScenarioChips({
  scenarios,
  activeScenarioId,
  onSelect,
  disabled,
}: {
  scenarios: AgentDemoScenario[]
  activeScenarioId: string
  onSelect: (scenarioId: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {scenarios.map((scenario) => {
        const isActive = scenario.id === activeScenarioId

        return (
          <Badge
            key={scenario.id}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-2.5 py-0.5 text-xs font-normal transition-colors",
              disabled && "pointer-events-none opacity-50",
              !isActive && "hover:bg-muted"
            )}
            onClick={() => onSelect(scenario.id)}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect(scenario.id)
              }
            }}
          >
            {scenario.label}
          </Badge>
        )
      })}
    </div>
  )
}

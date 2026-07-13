"use client"

import * as React from "react"

import {
  getAgentDemo,
  getDefaultScenario,
  getScenarioById,
} from "@/lib/agent-demos"
import type { DemoMessagePart } from "@/lib/agent-demos/types"
import { getDemoToolParts } from "@/lib/agent-demos/tool-labels"
import { AgentDemoInput } from "@/components/agent-demo/agent-demo-input"
import { AgentDemoMessage } from "@/components/agent-demo/agent-demo-message"
import { AgentDemoScenarioChips } from "@/components/agent-demo/agent-demo-scenario-chips"
import { AgentDemoThinking } from "@/components/agent-demo/agent-demo-thinking"
import type { DemoToolStatus } from "@/components/agent-demo/agent-demo-tool-steps"

const STEP_DELAY_MS = 600
const THINKING_DELAY_MS = 500
const RICH_VIEW_DELAY_MS = 2200
const TEXT_DELAY_MS = 400

type PlayerPhase = "idle" | "playing" | "complete"

type PlaybackView = {
  showUser: boolean
  showThinking: boolean
  revealedParts: DemoMessagePart[]
  toolStatuses: DemoToolStatus[]
}

function normalizePrompt(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

function buildIdleView(scenario: {
  assistantParts: DemoMessagePart[]
}): PlaybackView {
  const tools = getDemoToolParts(scenario.assistantParts)
  return {
    showUser: true,
    showThinking: false,
    revealedParts: scenario.assistantParts,
    toolStatuses: tools.map(() => "done" as const),
  }
}

function buildEmptyView(): PlaybackView {
  return {
    showUser: false,
    showThinking: false,
    revealedParts: [],
    toolStatuses: [],
  }
}

function toolStatusesForParts(parts: DemoMessagePart[]): DemoToolStatus[] {
  return getDemoToolParts(parts).map(() => "done" as const)
}

export function AgentDemoPlayer({ agentId }: { agentId: string }) {
  const demo = getAgentDemo(agentId)
  const defaultScenario = demo ? getDefaultScenario(demo) : undefined

  const [activeScenarioId, setActiveScenarioId] = React.useState(
    defaultScenario?.id ?? ""
  )
  const scenario = demo
    ? getScenarioById(demo, activeScenarioId) ?? getDefaultScenario(demo)
    : undefined

  const [phase, setPhase] = React.useState<PlayerPhase>("idle")
  const [input, setInput] = React.useState(scenario?.prompt ?? "")
  const [playingScenario, setPlayingScenario] = React.useState<
    NonNullable<typeof scenario> | null
  >(null)
  const [playback, setPlayback] = React.useState<PlaybackView>(buildEmptyView())
  const [hint, setHint] = React.useState<string>()
  const timeoutsRef = React.useRef<number[]>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const displayScenario = playingScenario ?? scenario

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeoutsRef.current.push(id)
  }

  const selectScenario = React.useCallback(
    (scenarioId: string) => {
      if (!demo || phase === "playing") return

      const next = getScenarioById(demo, scenarioId)
      if (!next) return

      clearTimeouts()
      setActiveScenarioId(scenarioId)
      setInput(next.prompt)
      setPlayback(buildIdleView(next))
      setPhase("idle")
      setHint(undefined)
    },
    [demo, phase]
  )

  React.useEffect(() => {
    if (!scenario) return
    setPlayback(buildIdleView(scenario))
    setPhase("idle")
    setInput(scenario.prompt)
    setHint(undefined)
  }, [scenario])

  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: phase === "playing" ? "smooth" : "auto",
    })
  }, [playback, phase])

  const replayScenario = React.useCallback(
    (targetScenario: NonNullable<typeof scenario>) => {
      const parts = targetScenario.assistantParts

      clearTimeouts()
      setHint(undefined)
      setPlayingScenario(targetScenario)
      setPhase("playing")
      setPlayback(buildEmptyView())

      let delay = STEP_DELAY_MS

      schedule(() => {
        setPlayback((prev) => ({ ...prev, showUser: true }))
      }, delay)

      delay += THINKING_DELAY_MS
      schedule(() => {
        setPlayback((prev) => ({ ...prev, showThinking: true }))
      }, delay)

      parts.forEach((part, index) => {
        const slice = parts.slice(0, index + 1)
        const toolsInSlice = getDemoToolParts(slice)

        if (part.type === "tool") {
          delay += STEP_DELAY_MS
          schedule(() => {
            setPlayback((prev) => ({
              ...prev,
              showThinking: false,
              revealedParts: slice,
              toolStatuses: toolsInSlice.map((_, toolIndex) =>
                toolIndex < toolsInSlice.length - 1 ? "done" : "running"
              ),
            }))
          }, delay)

          delay += STEP_DELAY_MS
          schedule(() => {
            setPlayback((prev) => ({
              ...prev,
              revealedParts: slice,
              toolStatuses: toolStatusesForParts(slice),
            }))
          }, delay)
          return
        }

        delay += STEP_DELAY_MS
        schedule(() => {
          setPlayback((prev) => ({
            ...prev,
            showThinking: false,
            revealedParts: slice,
            toolStatuses: toolStatusesForParts(slice),
          }))
        }, delay)

        if (part.type === "browser_view" || part.type === "webset_view") {
          delay += RICH_VIEW_DELAY_MS
        }
      })

      delay += TEXT_DELAY_MS
      schedule(() => {
        setPlayback({
          showUser: true,
          showThinking: false,
          revealedParts: parts,
          toolStatuses: toolStatusesForParts(parts),
        })
        setPhase("complete")
        setPlayingScenario(null)
      }, delay)
    },
    []
  )

  const handleSubmit = () => {
    if (!scenario || !demo || phase === "playing") return

    const normalizedInput = normalizePrompt(input)
    const matchingScenario = demo.scenarios.find(
      (item) => normalizePrompt(item.prompt) === normalizedInput
    )

    if (!matchingScenario) {
      setHint(
        "This demo only replays example prompts. Pick a scenario chip above or install locally for custom prompts."
      )
      return
    }

    if (matchingScenario.id !== activeScenarioId) {
      setActiveScenarioId(matchingScenario.id)
    }

    replayScenario(matchingScenario)
  }

  if (!demo || !scenario) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-sm">
        Demo not found for agent &quot;{agentId}&quot;.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border shrink-0 border-b px-3 py-2 pr-11">
        <p className="text-muted-foreground mb-1.5 text-xs">Try a capability</p>
        <AgentDemoScenarioChips
          scenarios={demo.scenarios}
          activeScenarioId={activeScenarioId}
          onSelect={selectScenario}
          disabled={phase === "playing"}
        />
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-3 py-4"
      >
        <div className="space-y-4">
          {playback.showUser && displayScenario ? (
            <AgentDemoMessage
              role="user"
              parts={displayScenario.prompt}
              animateIn={phase === "playing"}
            />
          ) : null}

          {playback.showThinking ? <AgentDemoThinking /> : null}

          {playback.revealedParts.length > 0 ? (
            <AgentDemoMessage
              role="assistant"
              parts={playback.revealedParts}
              toolStatuses={playback.toolStatuses}
              animateIn={phase !== "idle"}
              isReplaying={phase === "playing"}
            />
          ) : null}
        </div>
      </div>

      <div className="border-border shrink-0 border-t px-3 py-2">
        <AgentDemoInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={phase === "playing"}
          hint={hint}
          isLoading={phase === "playing"}
        />
      </div>
    </div>
  )
}

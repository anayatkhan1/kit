"use client"

import * as React from "react"

import {
  getAgentDemo,
  getDefaultScenario,
} from "@/lib/agent-demos"
import type { DemoMessagePart, DemoToolPart } from "@/lib/agent-demos/types"
import { getDemoToolParts } from "@/lib/agent-demos/tool-labels"
import { Badge } from "@/components/ui/badge"
import { AgentDemoInput } from "@/components/agent-demo/agent-demo-input"
import { AgentDemoMessage } from "@/components/agent-demo/agent-demo-message"
import { AgentDemoThinking } from "@/components/agent-demo/agent-demo-thinking"
import type { DemoToolStatus } from "@/components/agent-demo/agent-demo-tool-steps"

const STEP_DELAY_MS = 600
const THINKING_DELAY_MS = 500
const TEXT_DELAY_MS = 400

type PlayerPhase = "idle" | "playing" | "complete"

type PlaybackView = {
  showUser: boolean
  showThinking: boolean
  assistantTools: DemoToolPart[]
  toolStatuses: DemoToolStatus[]
  showText: boolean
}

function normalizePrompt(value: string) {
  return value.trim().replace(/\s+/g, " ")
}

function buildIdleView(scenario: {
  prompt: string
  assistantParts: DemoMessagePart[]
}): PlaybackView {
  const tools = getDemoToolParts(scenario.assistantParts)
  return {
    showUser: true,
    showThinking: false,
    assistantTools: tools,
    toolStatuses: tools.map(() => "done" as const),
    showText: true,
  }
}

function buildEmptyView(): PlaybackView {
  return {
    showUser: false,
    showThinking: false,
    assistantTools: [],
    toolStatuses: [],
    showText: false,
  }
}

export function AgentDemoPlayer({ agentId }: { agentId: string }) {
  const demo = getAgentDemo(agentId)
  const scenario = demo ? getDefaultScenario(demo) : undefined

  const [phase, setPhase] = React.useState<PlayerPhase>("idle")
  const [input, setInput] = React.useState(scenario?.prompt ?? "")
  const [playback, setPlayback] = React.useState<PlaybackView>(buildEmptyView())
  const [hint, setHint] = React.useState<string>()
  const timeoutsRef = React.useRef<number[]>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const allTools = React.useMemo(
    () => (scenario ? getDemoToolParts(scenario.assistantParts) : []),
    [scenario]
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

  const clearTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeoutsRef.current.push(id)
  }

  const replayScenario = React.useCallback(() => {
    if (!scenario) return

    clearTimeouts()
    setHint(undefined)
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

    allTools.forEach((tool, index) => {
      delay += STEP_DELAY_MS

      schedule(() => {
        setPlayback((prev) => ({
          ...prev,
          showThinking: false,
          assistantTools: allTools.slice(0, index + 1),
          toolStatuses: allTools.slice(0, index + 1).map((_, toolIndex) =>
            toolIndex < index ? "done" : "running"
          ),
        }))
      }, delay)

      delay += STEP_DELAY_MS
      schedule(() => {
        setPlayback((prev) => ({
          ...prev,
          assistantTools: allTools.slice(0, index + 1),
          toolStatuses: allTools.slice(0, index + 1).map(() => "done" as const),
        }))
      }, delay)
    })

    delay += TEXT_DELAY_MS
    schedule(() => {
      setPlayback((prev) => ({
        ...prev,
        showThinking: false,
        assistantTools: allTools,
        toolStatuses: allTools.map(() => "done" as const),
        showText: true,
      }))
      setPhase("complete")
    }, delay)
  }, [allTools, scenario])

  const handleSubmit = () => {
    if (!scenario || phase === "playing") return

    const normalizedInput = normalizePrompt(input)
    const normalizedPrompt = normalizePrompt(scenario.prompt)

    if (normalizedInput !== normalizedPrompt) {
      setHint(
        "This demo only replays the example prompt. Install the agent locally to use custom prompts."
      )
      return
    }

    replayScenario()
  }

  if (!demo || !scenario) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-sm">
        Demo not found for agent &quot;{agentId}&quot;.
      </div>
    )
  }

  const assistantParts: DemoMessagePart[] = playback.showText
    ? scenario.assistantParts
    : playback.assistantTools

  return (
    <div className="flex h-full flex-col">
      <div className="border-border bg-muted/20 flex shrink-0 items-center justify-between border-b px-3 py-2">
        <div className="min-w-0">
          <span className="text-foreground block text-sm font-medium">
            {demo.label}
          </span>
          <span className="text-muted-foreground block truncate text-xs">
            {demo.description}
          </span>
        </div>
        <Badge variant="secondary" className="ml-2 shrink-0 text-xs font-normal">
          Example demo
        </Badge>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-3 py-4"
      >
        <div className="space-y-4">
          {playback.showUser ? (
            <AgentDemoMessage
              role="user"
              parts={scenario.prompt}
              animateIn={phase === "playing"}
            />
          ) : null}

          {playback.showThinking ? <AgentDemoThinking /> : null}

          {playback.assistantTools.length > 0 || playback.showText ? (
            <AgentDemoMessage
              role="assistant"
              parts={assistantParts}
              toolStatuses={playback.toolStatuses}
              animateIn={phase !== "idle"}
            />
          ) : null}
        </div>
      </div>

      <div className="border-border bg-muted/10 shrink-0 border-t px-3 py-3">
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

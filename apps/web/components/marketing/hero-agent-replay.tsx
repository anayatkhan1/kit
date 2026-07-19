"use client"

import * as React from "react"
import { Bot, Check, Loader2, Sparkles, User } from "lucide-react"

import type { DemoMessagePart, DemoToolPart } from "@/lib/agent-demos/types"
import {
  getDemoText,
  getDemoToolLabel,
  getDemoToolParts,
} from "@/lib/agent-demos/tool-labels"
import { AgentDemoFormattedText } from "@/components/agent-demo/agent-demo-formatted-text"
import type { DemoToolStatus } from "@/components/agent-demo/agent-demo-tool-steps"
import { cn } from "@/lib/utils"

type HeroScenario = {
  id: string
  label: string
  prompt: string
  assistantParts: DemoMessagePart[]
}

const HERO_SCENARIOS: HeroScenario[] = [
  {
    id: "search",
    label: "Search & cite",
    prompt: "Find top AI coding agents launched this month with citations.",
    assistantParts: [
      {
        type: "tool",
        tool: "web_search",
        input: { query: "AI coding agents launched July 2026" },
      },
      {
        type: "tool",
        tool: "answer_question",
        input: { question: "Top AI coding agents this month?" },
      },
      {
        type: "text",
        text: `• **Cursor Agent** — IDE-native multi-file agent. [cursor.com](https://cursor.com)
• **Devin 2.0** — End-to-end software engineer. [cognition.ai](https://cognition.ai)
• **Windsurf Cascade** — Flow-based coding agent. [windsurf.com](https://windsurf.com)`,
      },
    ],
  },
  {
    id: "research",
    label: "Deep research",
    prompt: "Summarize EU AI Act enforcement changes for model providers.",
    assistantParts: [
      {
        type: "tool",
        tool: "deep_research",
        input: { task: "EU AI Act foundation model enforcement 2026" },
      },
      {
        type: "text",
        text: `• **Docs duties** — Technical docs + training-data summaries required.
• **Systemic risk** — Extra audits above compute thresholds.
• **Surveillance** — Authorities can request evaluations pre-launch.`,
      },
    ],
  },
  {
    id: "browser",
    label: "Browser",
    prompt: "Open anthropic.com/pricing and summarize Claude plan tiers.",
    assistantParts: [
      {
        type: "tool",
        tool: "use_browser",
        input: { task: "Extract Claude pricing tiers" },
      },
      {
        type: "text",
        text: `Claude tiers on the pricing page: **Free**, **Pro**, **Team**, and **Enterprise**. API usage is billed separately per million tokens.`,
      },
    ],
  },
]

const STEP_MS = 560
const THINKING_MS = 520
const HOLD_MS = 3200
const RESET_MS = 650

type Phase = "idle" | "user" | "thinking" | "tools" | "answer" | "hold"

type Playback = {
  phase: Phase
  scenarioIndex: number
  revealedTools: DemoToolPart[]
  toolStatuses: DemoToolStatus[]
  showText: boolean
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function finalPlayback(scenarioIndex: number): Playback {
  const scenario = HERO_SCENARIOS[scenarioIndex]!
  const tools = getDemoToolParts(scenario.assistantParts)
  return {
    phase: "hold",
    scenarioIndex,
    revealedTools: tools,
    toolStatuses: tools.map(() => "done"),
    showText: true,
  }
}

function HeroToolSteps({
  tools,
  statuses,
}: {
  tools: DemoToolPart[]
  statuses?: DemoToolStatus[]
}) {
  if (tools.length === 0) return null

  return (
    <div className="space-y-1.5">
      {tools.map((tool, index) => {
        const status = statuses?.[index] ?? "done"
        const isRunning = status === "running"
        const isPending = status === "pending"

        return (
          <div
            key={`${tool.tool}-${index}`}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-all duration-500",
              isRunning &&
                "bg-primary/8 ring-primary/20 shadow-[inset_0_0_0_1px_rgba(109,119,213,0.18)] ring-1",
              status === "done" && "bg-muted/40",
              isPending && "opacity-35"
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full",
                isRunning && "bg-primary/15 text-primary",
                status === "done" &&
                  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                isPending && "bg-muted text-muted-foreground"
              )}
            >
              {isRunning ? (
                <Loader2 className="size-3 animate-spin" />
              ) : status === "done" ? (
                <Check className="size-3" strokeWidth={2.5} />
              ) : (
                <span className="bg-muted-foreground/40 size-1 rounded-full" />
              )}
            </span>
            <span
              className={cn(
                "text-foreground/85 min-w-0 flex-1 truncate tracking-tight",
                isRunning && "text-foreground font-medium"
              )}
            >
              {getDemoToolLabel(tool)}
            </span>
            {isRunning ? (
              <span className="text-primary/80 text-[10px] tracking-wide uppercase">
                Live
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export function HeroAgentReplay() {
  const [playback, setPlayback] = React.useState<Playback>({
    phase: "idle",
    scenarioIndex: 0,
    revealedTools: [],
    toolStatuses: [],
    showText: false,
  })
  const [mounted, setMounted] = React.useState(false)
  const timeoutsRef = React.useRef<number[]>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const playRef = React.useRef<(index: number) => void>(() => {})

  const scenario = HERO_SCENARIOS[playback.scenarioIndex]!
  const answerText = getDemoText(scenario.assistantParts)
  const isAnimating =
    playback.phase !== "idle" &&
    playback.phase !== "hold" &&
    playback.phase !== "answer"

  const clearTimeouts = React.useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id))
    timeoutsRef.current = []
  }, [])

  const schedule = React.useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay)
    timeoutsRef.current.push(id)
  }, [])

  const playScenario = React.useCallback(
    (index: number) => {
      const next = HERO_SCENARIOS[index]
      if (!next) return

      clearTimeouts()

      const tools = getDemoToolParts(next.assistantParts)
      let delay = 280

      setPlayback({
        phase: "idle",
        scenarioIndex: index,
        revealedTools: [],
        toolStatuses: [],
        showText: false,
      })

      schedule(() => {
        setPlayback({
          phase: "user",
          scenarioIndex: index,
          revealedTools: [],
          toolStatuses: [],
          showText: false,
        })
      }, delay)

      delay += THINKING_MS
      schedule(() => {
        setPlayback((prev) => ({ ...prev, phase: "thinking" }))
      }, delay)

      tools.forEach((_, toolIndex) => {
        delay += STEP_MS
        const slice = tools.slice(0, toolIndex + 1)
        schedule(() => {
          setPlayback((prev) => ({
            ...prev,
            phase: "tools",
            revealedTools: slice,
            toolStatuses: slice.map((_, i) =>
              i < slice.length - 1 ? "done" : "running"
            ),
          }))
        }, delay)

        delay += STEP_MS
        schedule(() => {
          setPlayback((prev) => ({
            ...prev,
            revealedTools: slice,
            toolStatuses: slice.map(() => "done"),
          }))
        }, delay)
      })

      delay += STEP_MS
      schedule(() => {
        setPlayback((prev) => ({
          ...prev,
          phase: "answer",
          revealedTools: tools,
          toolStatuses: tools.map(() => "done"),
          showText: true,
        }))
      }, delay)

      delay += HOLD_MS
      schedule(() => {
        setPlayback((prev) => ({ ...prev, phase: "hold" }))
      }, delay)

      delay += RESET_MS
      schedule(() => {
        const nextIndex = (index + 1) % HERO_SCENARIOS.length
        playRef.current(nextIndex)
      }, delay)
    },
    [clearTimeouts, schedule]
  )

  playRef.current = playScenario

  React.useEffect(() => {
    setMounted(true)
    if (prefersReducedMotion()) {
      setPlayback(finalPlayback(0))
      return
    }

    const startId = window.setTimeout(() => playRef.current(0), 700)
    return () => {
      window.clearTimeout(startId)
      clearTimeouts()
    }
  }, [clearTimeouts])

  React.useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: playback.phase === "hold" ? "auto" : "smooth",
    })
  }, [playback])

  const showUser =
    playback.phase === "user" ||
    playback.phase === "thinking" ||
    playback.phase === "tools" ||
    playback.phase === "answer" ||
    playback.phase === "hold"

  const showThinking = playback.phase === "thinking"
  const showAssistant =
    playback.phase === "tools" ||
    playback.phase === "answer" ||
    playback.phase === "hold"

  return (
    <div className="bg-background/40 flex h-[360px] flex-col overflow-hidden md:h-[400px]">
      <div className="border-border/50 flex shrink-0 flex-col gap-2.5 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="from-foreground to-foreground/80 text-background flex size-8 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm">
            <Bot className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-foreground truncate text-[13px] font-medium tracking-tight">
                Web Agent
              </p>
              <span className="text-muted-foreground hidden text-[10px] tracking-wide uppercase sm:inline">
                registry
              </span>
            </div>
            <p className="text-muted-foreground truncate text-[11px]">
              Search · deep research · browser · websets
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-tight ring-1 transition-colors duration-500",
              isAnimating
                ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
                : "bg-muted/70 text-muted-foreground ring-border/60"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full transition-all duration-500",
                isAnimating
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  : "bg-muted-foreground/45"
              )}
            />
            {mounted && isAnimating ? "Running" : "Ready"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {HERO_SCENARIOS.map((item, index) => {
            const active = index === playback.scenarioIndex
            return (
              <span
                key={item.id}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[11px] tracking-tight transition-all duration-500",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground bg-transparent"
                )}
              >
                {item.label}
              </span>
            )
          })}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        {!showUser ? (
          <div className="text-muted-foreground flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted/60 flex size-10 items-center justify-center rounded-2xl ring-1 ring-black/5 dark:ring-white/10">
              <Sparkles className="size-4 opacity-70" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground/80 text-xs font-medium tracking-tight">
                Preparing agent run
              </p>
              <p className="text-[11px] opacity-70">
                Replaying a real capability path…
              </p>
            </div>
          </div>
        ) : null}

        {showUser ? (
          <div
            className={cn(
              "flex justify-end",
              playback.phase === "user" &&
                "animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            )}
          >
            <div className="flex max-w-[90%] flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 px-1">
                <div className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full shadow-sm">
                  <User className="size-3" />
                </div>
                <span className="text-muted-foreground text-[11px] font-medium tracking-tight">
                  You
                </span>
              </div>
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[13px] leading-relaxed shadow-[0_8px_24px_-12px_rgba(109,119,213,0.65)]">
                {scenario.prompt}
              </div>
            </div>
          </div>
        ) : null}

        {showThinking ? (
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex justify-start duration-500">
            <div className="flex max-w-[88%] flex-col gap-1.5">
              <div className="flex items-center gap-2 px-1">
                <div className="from-foreground to-foreground/80 text-background flex size-5 items-center justify-center rounded-full bg-gradient-to-br">
                  <Bot className="size-3" />
                </div>
                <span className="text-muted-foreground text-[11px] font-medium tracking-tight">
                  AI Agent
                </span>
              </div>
              <div className="bg-card/90 border-border/70 rounded-2xl rounded-tl-md border px-3.5 py-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-muted-foreground/70 size-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
                  <span className="bg-muted-foreground/70 size-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
                  <span className="bg-muted-foreground/70 size-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
                  <span className="text-muted-foreground ml-1 text-[11px] tracking-tight">
                    Choosing tools…
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showAssistant ? (
          <div
            className={cn(
              "flex justify-start",
              playback.phase === "tools" &&
                "animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            )}
          >
            <div className="flex w-full max-w-full flex-col items-start gap-1.5">
              <div className="flex items-center gap-2 px-1">
                <div className="from-foreground to-foreground/80 text-background flex size-5 items-center justify-center rounded-full bg-gradient-to-br">
                  <Bot className="size-3" />
                </div>
                <span className="text-muted-foreground text-[11px] font-medium tracking-tight">
                  AI Agent
                </span>
              </div>
              <div className="bg-card/90 border-border/70 w-full rounded-2xl rounded-tl-md border px-3.5 py-3 text-[13px] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                <div className="space-y-3">
                  {playback.revealedTools.length > 0 ? (
                    <HeroToolSteps
                      tools={playback.revealedTools}
                      statuses={playback.toolStatuses}
                    />
                  ) : null}
                  {playback.showText ? (
                    <div
                      className={cn(
                        playback.revealedTools.length > 0 &&
                          "border-border/60 border-t pt-3",
                        "animate-in fade-in-0 duration-700"
                      )}
                    >
                      <AgentDemoFormattedText text={answerText} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react"
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Database,
  FileCode2,
  FileJson2,
  Folder,
  Lock,
  MessageSquare,
  Terminal,
} from "lucide-react"

import { cn } from "@/lib/utils"

function useLoopIndex(length: number, intervalMs: number, enabled: boolean) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (!enabled || length <= 1) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [enabled, intervalMs, length])

  return index
}

const installedFiles = [
  {
    name: "agent.ts",
    icon: FileCode2,
    code: [
      { text: "export function webAgent(", color: "text-sky-400" },
      { text: "  messages: ModelMessage[]", color: "text-muted-foreground" },
      { text: ") {", color: "text-sky-400" },
      { text: "  return streamText({", color: "text-foreground/80" },
      { text: "    model: anthropic(...),", color: "text-emerald-400" },
      { text: "    tools: webToolset,", color: "text-violet-400" },
      { text: "    system: SYSTEM_PROMPT,", color: "text-foreground/80" },
      { text: "  })", color: "text-foreground/80" },
      { text: "}", color: "text-sky-400" },
    ],
  },
  {
    name: "prompt.ts",
    icon: FileCode2,
    code: [
      { text: "export const SYSTEM_PROMPT = `", color: "text-sky-400" },
      { text: "You are agentcn-web.", color: "text-foreground/80" },
      { text: "Use web_search for lookups.", color: "text-emerald-400" },
      { text: "Prefer citations in markdown.", color: "text-foreground/80" },
      { text: "Confirm before deep research.", color: "text-violet-400" },
      { text: "`", color: "text-sky-400" },
    ],
  },
  {
    name: "tools/",
    icon: Folder,
    code: [
      { text: "web_search.ts", color: "text-foreground/80" },
      { text: "deep_research.ts", color: "text-foreground/80" },
      { text: "use_browser.ts", color: "text-emerald-400" },
      { text: "webset.ts", color: "text-violet-400" },
      { text: "toolset.ts", color: "text-sky-400" },
    ],
  },
  {
    name: "schema.ts",
    icon: FileJson2,
    code: [
      { text: "webSearchSchema = z.object({", color: "text-sky-400" },
      { text: "  query: z.string(),", color: "text-foreground/80" },
      { text: "  num_results: z.number()", color: "text-emerald-400" },
      { text: "    .min(1).max(25)", color: "text-muted-foreground" },
      { text: "})", color: "text-sky-400" },
    ],
  },
]

export function SourceFilesVisual() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.35 })
  const reduced = useReducedMotion() ?? false
  const activeIndex = useLoopIndex(
    installedFiles.length,
    2400,
    inView && !reduced
  )
  const active = installedFiles[activeIndex]!

  return (
    <div
      ref={ref}
      className="h-full overflow-hidden rounded-xl border border-border/70 bg-background/90 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(109,119,213,0.12),transparent_55%)]" />
      <div className="relative flex h-full">
        <div className="w-[42%] border-r border-border/60 bg-muted/20 p-3">
          <p className="mb-2.5 px-1.5 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            ai/agents/web
          </p>
          <div className="space-y-1">
            {installedFiles.map(({ name, icon: Icon }, index) => {
              const isActive = index === activeIndex
              return (
                <motion.div
                  key={name}
                  animate={{
                    backgroundColor: isActive
                      ? "rgba(109,119,213,0.14)"
                      : "rgba(0,0,0,0)",
                    x: isActive ? 2 : 0,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3 shrink-0 transition-colors",
                      isActive && "text-primary"
                    )}
                  />
                  <span className="truncate tracking-tight">{name}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="source-active-dot"
                      className="ml-auto size-1.5 rounded-full bg-primary"
                    />
                  ) : null}
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-red-400/80" />
            <span className="size-1.5 rounded-full bg-amber-400/80" />
            <span className="size-1.5 rounded-full bg-emerald-400/80" />
            <span className="ml-1 truncate text-[10px] text-muted-foreground">
              {active.name}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 font-mono text-[10px] leading-5"
            >
              {active.code.map((line, i) => (
                <motion.p
                  key={`${active.name}-${i}`}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className={line.color}
                >
                  {line.text}
                </motion.p>
              ))}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block h-3.5 w-[2px] bg-primary align-middle"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const installSteps = [
  "Fetching web-agent from registry",
  "Writing 13 source files",
  "Installing ai, zod, exa-js…",
  "Scaffolding .env keys",
]

export function CliInstallVisual() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.35 })
  const reduced = useReducedMotion() ?? false
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (!inView || reduced) return
    const id = window.setInterval(() => setTick((t) => t + 1), 550)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  const cycleLength = installSteps.length + 4
  const stepInCycle = reduced ? installSteps.length : tick % cycleLength
  const visibleCount = Math.min(stepInCycle, installSteps.length)
  const done = stepInCycle >= installSteps.length

  return (
    <div
      ref={ref}
      className="h-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0d11] text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,119,213,0.18),transparent_55%)]" />
      <div className="relative flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f57]/90" />
          <span className="size-2 rounded-full bg-[#febc2e]/90" />
          <span className="size-2 rounded-full bg-[#28c840]/90" />
        </div>
        <div className="ml-2 flex items-center gap-1.5 text-[10px] tracking-wider text-white/40 uppercase">
          <Terminal className="size-3" />
          agentcn
        </div>
      </div>

      <div className="relative space-y-3.5 p-4 font-mono">
        <div className="flex items-center gap-2 text-[11px]">
          <ChevronRight className="size-3 text-emerald-400" />
          <span className="text-white/90">npx agentcn@latest add web-agent</span>
          <motion.span
            animate={{ opacity: done ? 0 : [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="inline-block h-3.5 w-[2px] bg-emerald-400"
          />
        </div>

        <div className="space-y-2">
          {installSteps.map((step, index) => {
            const visible = index < visibleCount
            const running = index === visibleCount - 1 && !done
            return (
              <motion.div
                key={step}
                initial={false}
                animate={{
                  opacity: visible ? 1 : 0,
                  y: visible ? 0 : 6,
                  height: visible ? "auto" : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2.5 text-[10px] text-white/55">
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full",
                      running
                        ? "bg-primary/20 text-primary"
                        : "bg-emerald-400/12 text-emerald-400"
                    )}
                  >
                    {running ? (
                      <motion.span
                        className="size-1.5 rounded-full bg-current"
                        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                      />
                    ) : (
                      <Check className="size-2.5" strokeWidth={2.5} />
                    )}
                  </span>
                  <span className={cn(running && "text-white/80")}>{step}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-emerald-400/20 bg-emerald-400/8 px-3 py-2 text-[10px] text-emerald-300"
            >
              ✓ Web Agent installed — source is yours.
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

const promptLines = {
  old: "Always launch a browser session first.",
  next: "Prefer search. Use browser only when needed.",
}

export function CustomizeAgentVisual() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.35 })
  const reduced = useReducedMotion() ?? false
  const phaseIndex = useLoopIndex(3, 1800, inView && !reduced)
  const phase = reduced
    ? "new"
    : (["old", "swap", "new"] as const)[phaseIndex]!

  return (
    <div
      ref={ref}
      className="h-full overflow-hidden rounded-xl border border-border/70 bg-background/90 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(109,119,213,0.1),transparent_55%)]" />
      <div className="relative flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileCode2 className="size-3" />
          </span>
          <span className="text-[11px] font-medium tracking-tight">
            prompt.ts
          </span>
        </div>
        <motion.span
          key={phase}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "rounded-full px-2 py-0.5 text-[9px] font-medium tracking-tight",
            phase === "new"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          )}
        >
          {phase === "new" ? "Saved" : "Editing"}
        </motion.span>
      </div>

      <div className="relative space-y-2 p-4 font-mono text-[10px] leading-5">
        <p className="text-muted-foreground">{"<browser_usage>"}</p>

        <div className="min-h-[52px]">
          <AnimatePresence mode="wait">
            {phase !== "new" ? (
              <motion.p
                key="old"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: phase === "swap" ? 0.4 : 1,
                  x: phase === "swap" ? -4 : 0,
                }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-lg border border-red-500/15 bg-red-500/5 px-2.5 py-1.5 text-red-500/80 line-through"
              >
                {promptLines.old}
              </motion.p>
            ) : (
              <motion.p
                key="new"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1.5 text-emerald-600 dark:text-emerald-400"
              >
                {promptLines.next}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-0.5 inline-block h-3 w-[2px] bg-emerald-500 align-middle"
                />
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p className="text-muted-foreground">{"</browser_usage>"}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2.5 text-[9px] tracking-wide text-muted-foreground uppercase">
        {["Prompts", "Tools", "Schemas", "Providers"].map((item, index) => (
          <span
            key={item}
            className={cn(
              "transition-colors duration-500",
              phase === "new" && index === 0 && "text-emerald-500"
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

const kitFeatures = [
  { label: "Auth", icon: Lock },
  { label: "Chat UI", icon: MessageSquare },
  { label: "Postgres", icon: Database },
]

export function AgentKitVisual() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, amount: 0.3 })
  const reduced = useReducedMotion() ?? false

  return (
    <div
      ref={ref}
      className="relative flex h-full flex-col justify-end overflow-hidden rounded-xl border border-border/70 bg-background/85 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,119,213,0.16),transparent_60%)]" />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 p-5">
        <Link
          href="/templates/agentkit-starter"
          className="group/kit inline-flex items-center gap-1 rounded-full border border-[#6d77d5]/80 bg-linear-to-b from-[#6d77d5] to-[#5c67c7] py-1.5 pr-2.5 pl-3.5 text-[11px] font-medium text-white shadow-[0_0_40px_rgba(109,119,213,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          AgentKit template
          <ArrowUpRight className="size-3 transition-transform duration-300 group-hover/kit:translate-x-0.5 group-hover/kit:-translate-y-0.5" />
        </Link>

        <div className="grid w-full max-w-sm grid-cols-3 gap-2">
          {kitFeatures.map(({ label, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={
                inView || reduced
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{ delay: 0.08 + index * 0.1, duration: 0.4 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2 py-3.5 text-center"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-3.5" />
              </span>
              <span className="text-[10px] font-medium tracking-tight">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

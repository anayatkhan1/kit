"use client"

import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import {
  AgentKitVisual,
  CliInstallVisual,
  CustomizeAgentVisual,
  SourceFilesVisual,
} from "@/components/marketing/agent-product-visuals"
import { BentoNav } from "@/components/marketing/bento-nav"

const bentoData = [
  {
    title: "Source in your repo.",
    description:
      "The CLI adds agent files to your project so you can read prompts, tools, and wiring before you ship anything.",
    component: <SourceFilesVisual />,
    className: "md:col-span-7",
  },
  {
    title: "Install from the CLI.",
    description:
      "Each agent installs with npx agentcn@latest add. Add your provider API keys, then run it in your own Next.js app.",
    component: <CliInstallVisual />,
    className: "md:col-span-5",
  },
  {
    title: "Change what you need.",
    description:
      "Prompts, tools, env config, and providers are plain files. Edit them the same way you edit the rest of your app.",
    component: <CustomizeAgentVisual />,
    className: "md:col-span-7",
  },
  {
    title: "Need a full app?",
    description:
      "AgentKit is an open source starter with auth, chat UI, and Postgres if you want more than the agent module alone.",
    component: <AgentKitVisual />,
    className: "md:col-span-5",
    href: "/templates/agentkit-starter",
  },
]

const navOptions = [
  {
    name: "Overview",
    text: "AgentCN packages installable AI agents for your codebase. The CLI copies source into your repo instead of hiding logic behind a hosted API.",
  },
  {
    name: "Agents",
    text: "Agents ship as installable modules with their own docs and interactive examples. Pick one from the registry, add it to your app, and request new ones in GitHub discussions.",
  },
  {
    name: "Benefits",
    text: "Most teams rebuild the same agent scaffolding for every feature. AgentCN gives you a working starting point you can extend.",
  },
  {
    name: "Integration",
    text: "TypeScript and the Vercel AI SDK. Install agent source into your repo, add API keys, and wire a chat route when you are ready to ship.",
  },
]

export function Benefits() {
  return (
    <section className="from-background via-secondary/60 to-background bg-linear-to-b from-20%">
      <div className="container mx-auto flex w-full max-w-5xl flex-col items-center justify-start px-4! py-16 text-center md:items-start md:py-32 md:text-left">
        <div className="flex w-full flex-col md:flex-row md:gap-8">
          <div className="flex w-full md:w-1/2 md:items-end">
            <h2 className="leading-tighter font-gilroy text-foreground max-w-2xl text-5xl font-semibold tracking-tight text-pretty lg:leading-[1.1] lg:font-semibold xl:text-6xl/[4rem] xl:tracking-tighter dark:bg-linear-to-b dark:from-white/80 dark:via-white dark:to-white/60 dark:bg-clip-text dark:text-transparent">
              What you get with AgentCN
            </h2>
          </div>
          <div className="flex w-full items-end justify-end md:w-1/2">
            <BentoNav className="mt-6 md:mt-0" options={navOptions} />
          </div>
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 md:mt-14 md:grid-cols-12 md:grid-rows-[420px_420px]">
          {bentoData.map((item, index) => (
            <BentoCell
              key={item.title}
              {...item}
              index={index}
              className={cn("min-h-[420px] md:min-h-0 md:h-full", item.className)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoCell({
  title,
  description,
  component,
  href,
  index,
  className,
}: {
  title: string
  description: string
  component: React.ReactNode
  href?: string
  index: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "group/bento relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-secondary/40 large-accent-shadow transition-[border-color,box-shadow] duration-500 hover:border-primary/25 hover:shadow-[0_24px_60px_-36px_rgba(109,119,213,0.45)] md:min-h-0",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,119,213,0.1),transparent_55%)] opacity-70" />

      <div className="relative z-10 flex items-start justify-between gap-3 px-5 pt-5 pb-3 text-left">
        <div className="min-w-0 max-w-md">
          <p className="text-[15px] font-medium tracking-tight text-foreground md:text-base">
            {title}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {href ? (
          <a
            href={href}
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Open AgentKit template"
          >
            <ArrowUpRight className="size-3.5" />
          </a>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1 px-4 pb-4">{component}</div>
    </motion.div>
  )
}

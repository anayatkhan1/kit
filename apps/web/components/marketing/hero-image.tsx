import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { HeroAgentReplay } from "@/components/marketing/hero-agent-replay"
import { InstallCommand } from "@/components/marketing/install-command"
import { BorderBeam } from "@/components/ui/border-beam"
import { Meteors } from "@/components/ui/meteors"
import { Particles } from "@/components/ui/particles"

export function HeroImage() {
  const particlesColor = "#6d77d5"

  const customParticleOptions = {
    particles: {
      opacity: 0.55,
      quantity: 420,
      size: {
        value: {
          min: 0.4,
          max: 0.9,
        },
      },
      move: {
        quantity: 420,
        enable: true,
        speed: {
          min: 0.05,
          max: 0.15,
        },
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
      shadow: {
        enable: true,
        color: particlesColor,
        blur: 4,
        offset: {
          x: 0,
          y: 0,
        },
      },
      glow: {
        enable: true,
        color: particlesColor,
        distance: 8,
        size: 1.5,
      },
    },
    interactivity: {
      detectOn: "canvas",
      events: {
        onHover: {
          enable: false,
        },
      },
    },
  }

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden px-4 pb-20 md:pb-28">
      <div className="relative mx-auto w-full max-w-5xl">
        {/* Soft vignette so the product shot sits in atmosphere */}
        <div
          className="bg-background pointer-events-none absolute inset-0 z-10 mask-[radial-gradient(ellipse_95%_75%_at_50%_28%,transparent_40%,#000_100%)]"
          aria-hidden="true"
        />

        {/* Ambient light + particles behind the frame */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[-220px] z-1 h-[460px] bg-[radial-gradient(circle_at_bottom_center,rgba(109,119,213,0.55),transparent_72%)] mask-[radial-gradient(circle_at_50%_70%,white,transparent)] md:top-[-260px] md:h-[540px]"
          aria-hidden="true"
        >
          <Particles customOptions={customParticleOptions} className="w-full" />
          <Meteors number={4} />
        </div>

        {/* Product frame */}
        <div className="relative z-2 mx-auto w-full">
          <div
            className="pointer-events-none absolute -inset-x-10 -inset-y-8 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(109,119,213,0.18),transparent_70%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,rgba(109,119,213,0.28),transparent_70%)]"
            aria-hidden="true"
          />

          <div className="border-border/70 bg-card/90 relative overflow-hidden rounded-[1.25rem] border shadow-[0_30px_100px_-40px_rgba(60,70,140,0.55)] ring-1 ring-black/5 backdrop-blur-xl dark:bg-card/80 dark:shadow-[0_40px_120px_-40px_rgba(109,119,213,0.45)] dark:ring-white/10">
            <BorderBeam
              lightColor="#a5b4fc"
              duration={9}
              borderWidth={1}
              className="rounded-[inherit] opacity-70 dark:opacity-90"
            />

            {/* Window chrome */}
            <div className="border-border/60 relative z-10 flex items-center gap-3 border-b bg-gradient-to-b from-white/40 to-transparent px-4 py-3 dark:from-white/5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]/90 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]/90 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
                <span className="size-2.5 rounded-full bg-[#28c840]/90 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
              </div>
              <div className="bg-muted/50 text-muted-foreground mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-[11px] ring-1 ring-black/5 dark:ring-white/5">
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 inline-flex size-3.5 items-center justify-center rounded-full text-[8px] font-semibold">
                  ✓
                </span>
                <span className="truncate tracking-tight">
                  agentcn.dev/docs/agents/web-agent
                </span>
              </div>
              <div className="hidden w-[52px] sm:block" />
            </div>

            {/* Tabs */}
            <div className="border-border/60 relative z-10 flex items-center gap-6 border-b px-4 text-sm">
              <span className="border-foreground text-foreground border-b-2 py-2.5 text-[13px] font-medium tracking-tight">
                Preview
              </span>
              <span className="text-muted-foreground py-2.5 text-[13px]">
                Setup
              </span>
            </div>

            <div className="relative z-10">
              <HeroAgentReplay />
            </div>

            {/* Install CTA strip */}
            <div className="border-border/60 relative z-10 flex flex-wrap items-center justify-between gap-3 border-t bg-gradient-to-r from-muted/40 via-muted/20 to-transparent px-4 py-3.5">
              <InstallCommand className="max-w-full" />
              <Link
                href="/docs/agents/web-agent"
                className="text-foreground group inline-flex items-center gap-1 text-xs font-medium tracking-tight transition-colors hover:text-primary md:text-[13px]"
              >
                Explore the agent
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Soft floor reflection */}
          <div
            className="pointer-events-none mx-auto mt-3 h-16 w-[88%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(109,119,213,0.18),transparent_70%)] blur-xl dark:bg-[radial-gradient(ellipse_at_center,rgba(109,119,213,0.28),transparent_70%)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}

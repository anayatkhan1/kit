import Link from "next/link"

import { AgentcnLogo } from "@/components/agentcn-logo"
import { Meteors } from "@/components/ui/meteors"
import { Particles } from "@/components/ui/particles"

export function HeroImage() {
  const particlesColor = "#8b5cf6"

  const customParticleOptions = {
    particles: {
      opacity: 0.8,
      quantity: 800,
      size: {
        value: {
          min: 0.5,
          max: 0.8,
        },
      },
      move: {
        quantity: 800,
        enable: true,
        speed: {
          min: 0.1,
          max: 0.1,
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
        blur: 5,
        offset: {
          x: 0,
          y: 0,
        },
      },
      glow: {
        enable: true,
        color: particlesColor,
        distance: 10,
        size: 2,
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
    <div className="flex w-full items-center justify-center overflow-hidden px-4 pb-16 md:pb-20">
      <div className="relative mx-auto w-full max-w-4xl">
        <div
          className="bg-background pointer-events-none absolute inset-0 z-10 [mask-image:radial-gradient(ellipse_100%_75%_at_50%_20%,transparent_50%,#000_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 -top-[200px] z-[1] h-[400px] bg-[radial-gradient(circle_at_bottom_center,#6d77d5,transparent_75%)] [mask-image:radial-gradient(circle_at_50%_65%,white,transparent)] md:-top-[240px] md:h-[480px]"
          aria-hidden="true"
        >
          <Particles customOptions={customParticleOptions} className="w-full" />
          <Meteors number={5} />
        </div>

        <div className="border-border bg-card relative z-5 mx-auto w-full overflow-hidden rounded-xl border shadow-2xl">
          <div className="border-border flex items-center gap-2 border-b px-4 py-3">
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-yellow-500/70" />
            <span className="size-2.5 rounded-full bg-green-500/70" />
            <span className="text-muted-foreground ml-2 text-xs">
              agentcn.dev/docs/agents
            </span>
          </div>

          <div className="flex gap-4 border-b px-4 pt-3 text-sm">
            <span className="text-foreground font-medium">Preview</span>
            <span className="text-muted-foreground">Code</span>
          </div>

          <div className="bg-background p-4 md:p-6">
            <div className="border-border flex min-h-[220px] flex-col overflow-hidden rounded-lg border md:min-h-[260px]">
              <div className="border-border flex items-center gap-2 border-b px-3 py-2">
                <AgentcnLogo className="text-foreground size-5" />
                <span className="text-muted-foreground text-xs">Agent preview</span>
              </div>
              <div className="flex flex-1 flex-col justify-end gap-3 p-3">
                <div className="bg-muted/50 text-foreground ml-auto max-w-[85%] rounded-lg px-3 py-2 text-sm">
                  What are the latest updates on EU AI regulation this month?
                </div>
                <div className="border-border bg-card flex items-center gap-2 rounded-lg border px-3 py-2">
                  <span className="text-muted-foreground flex-1 text-sm">
                    Search the web or paste a URL to research…
                  </span>
                  <span className="bg-primary flex size-7 shrink-0 items-center justify-center rounded-full text-xs text-white">
                    ↑
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3">
            <code className="text-muted-foreground text-xs md:text-sm">
              npx agentcn@latest add &lt;agent&gt;
            </code>
            <Link
              href="/docs"
              className="text-primary text-xs font-medium hover:underline md:text-sm"
            >
              Browse agents →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

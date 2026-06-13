"use client"

import { AgentcnLogo } from "@/components/agentcn-logo"
import { BorderBeam } from "@/components/ui/border-beam"

export function CpuVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="cpu-shadow mb-[135px] flex aspect-square w-[170px] items-center justify-center overflow-hidden rounded-[2rem] md:mb-[80px] md:w-[150px]">
        <BorderBeam lightColor="#7876c5" duration={2} />

        <div className="accent-shadow bg-background absolute flex aspect-square w-[145px] items-center justify-center overflow-hidden rounded-[1.5rem] md:w-[130px]">
          <BorderBeam lightColor="#7876c5" duration={3} />
          <AgentcnLogo className="text-foreground size-16 opacity-90 md:size-14" />
        </div>
      </div>
    </div>
  )
}

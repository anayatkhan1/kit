import { AgentcnLogo } from "@/components/agentcn-logo"
import { cn } from "@/lib/utils"

export function LogoTiles() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-x-4 top-0 mx-auto grid h-[320px] w-[274px] grid-cols-5 grid-rows-6 gap-1 lg:inset-x-12">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square h-[50px] w-[50px] overflow-hidden rounded transition-transform duration-150 hover:rotate-[15deg]",
              index === 2 ||
                index === 4 ||
                index === 6 ||
                index === 7 ||
                index === 10 ||
                index === 11 ||
                index === 13 ||
                index === 16 ||
                index === 17 ||
                index === 18 ||
                index === 20 ||
                index === 21
                ? "shadow-[0_1.5px_0.5px_2.5px_rgba(0,0,0,0.5),0_0_0.5px_1px_#000,inset_0_2px_1px_1px_rgba(0,0,0,0.25),inset_0_1px_1px_1px_rgba(255,255,255,0.2)]"
                : "",
              index === 8 || index === 12 || index === 14 || index === 15
                ? "bg-[#21222550] shadow-[0_1.5px_0.5px_2.5px_rgba(0,0,0,0.5),0_0_0.5px_1px_#000,inset_0_2px_1px_1px_rgba(0,0,0,0.25),inset_0_1px_1px_1px_rgba(255,255,255,0.2)]"
                : ""
            )}
          >
            {index === 12 && (
              <div className="text-foreground flex h-full w-full items-center justify-center p-2">
                <AgentcnLogo className="size-8" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

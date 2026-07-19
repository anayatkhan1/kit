import { cn } from "@/lib/utils"

export function HeroBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#6d77d5]/[0.06] via-[#6d77d5]/[0.02] to-transparent dark:from-[#6d77d5]/[0.12] dark:via-[#6d77d5]/[0.05]" />

      <div className="animate-hero-glow absolute top-[-20%] left-1/2 h-[600px] w-[min(110%,980px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,119,213,0.22)_0%,rgba(109,119,213,0.08)_38%,transparent_72%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(109,119,213,0.34)_0%,rgba(109,119,213,0.12)_40%,transparent_74%)]" />

      <div className="animate-hero-glow-slow absolute top-[6%] left-[14%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(109,119,213,0.14)_0%,transparent_72%)] blur-3xl [animation-delay:1.5s] dark:bg-[radial-gradient(circle,rgba(109,119,213,0.2)_0%,transparent_72%)]" />

      <div className="animate-hero-glow-slow absolute top-[10%] right-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_72%)] blur-3xl [animation-delay:3.5s] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.18)_0%,transparent_72%)]" />

      <div className="absolute top-[20%] left-1/2 h-56 w-[min(92%,720px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_68%)] blur-2xl dark:bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(255,255,255,0.07)_0%,transparent_68%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.055)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.055)_1px,transparent_1px)] bg-size-[44px_44px] bg-center mask-[radial-gradient(ellipse_78%_68%_at_50%_16%,#000_10%,transparent_100%)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.045)_1px,transparent_1px)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle,oklch(0.5_0_0/0.06)_1px,transparent_1px)] bg-size-[44px_44px] bg-center mask-[radial-gradient(ellipse_84%_72%_at_50%_18%,#000_6%,transparent_100%)] dark:bg-[radial-gradient(circle,oklch(1_0_0/0.055)_1px,transparent_1px)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6d77d5]/35 to-transparent" />

      <div className="bg-background/25 dark:bg-background/35 absolute inset-0" />

      <div className="from-background absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t to-transparent" />
    </div>
  )
}

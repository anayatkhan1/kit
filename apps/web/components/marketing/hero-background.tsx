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
      <div className="absolute inset-0 bg-gradient-to-b from-[#6d77d5]/[0.06] via-[#6d77d5]/[0.02] to-transparent dark:from-[#6d77d5]/[0.12] dark:via-[#7c3aed]/[0.05]" />

      <div className="animate-hero-glow absolute top-[-18%] left-1/2 h-[560px] w-[min(110%,920px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,119,213,0.24)_0%,rgba(109,119,213,0.1)_34%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(109,119,213,0.32)_0%,rgba(139,92,246,0.12)_38%,transparent_72%)]" />

      <div className="animate-hero-glow-slow absolute top-[8%] left-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(109,119,213,0.18)_0%,transparent_72%)] blur-3xl [animation-delay:1.5s] dark:bg-[radial-gradient(circle,rgba(109,119,213,0.24)_0%,transparent_72%)]" />

      <div className="animate-hero-glow-slow absolute top-[12%] right-[12%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_72%)] blur-3xl [animation-delay:3.5s] dark:bg-[radial-gradient(circle,rgba(124,58,237,0.2)_0%,transparent_72%)]" />

      <div className="absolute top-[22%] left-1/2 h-52 w-[min(92%,680px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(255,255,255,0.045)_0%,transparent_68%)] blur-2xl dark:bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(255,255,255,0.06)_0%,transparent_68%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0/0.07)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0/0.07)_1px,transparent_1px)] bg-size-[40px_40px] bg-center mask-[radial-gradient(ellipse_80%_70%_at_50%_18%,#000_12%,transparent_100%)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.055)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.055)_1px,transparent_1px)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle,oklch(0.5_0_0/0.08)_1px,transparent_1px)] bg-size-[40px_40px] bg-center mask-[radial-gradient(ellipse_85%_75%_at_50%_20%,#000_8%,transparent_100%)] dark:bg-[radial-gradient(circle,oklch(1_0_0/0.07)_1px,transparent_1px)]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,oklch(1_0_0/0.025)_1px,transparent_1px),linear-gradient(45deg,oklch(1_0_0/0.02)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_90%_80%_at_50%_15%,#000_5%,transparent_100%)] opacity-70 dark:bg-[linear-gradient(135deg,oklch(1_0_0/0.035)_1px,transparent_1px),linear-gradient(45deg,oklch(1_0_0/0.03)_1px,transparent_1px)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6d77d5]/30 to-transparent" />

      <div className="bg-background/20 dark:bg-background/30 absolute inset-0" />

      <div className="from-background absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent" />
    </div>
  )
}

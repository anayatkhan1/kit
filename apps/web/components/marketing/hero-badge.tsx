import { cn } from "@/lib/utils"

export function HeroBadge({
  children,
  icon,
  className,
  iconClassName,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  className?: string
  iconClassName?: string
}) {
  return (
    <div
      className={cn(
        "group relative z-10 flex h-7 items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-2.5 pr-3 font-mono text-[11px] text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-foreground/4 hover:text-foreground",
        className
      )}
    >
      <div
        className={cn(
          "flex size-3.5 shrink-0 items-center justify-center opacity-70 transition-opacity duration-300 group-hover:opacity-100",
          iconClassName
        )}
      >
        {icon}
      </div>
      {children}
    </div>
  )
}

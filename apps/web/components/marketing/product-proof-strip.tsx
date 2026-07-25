import { Braces, KeyRound, PackageCheck, ServerOff } from "lucide-react"

import { cn } from "@/lib/utils"

const proofPoints = [
  { label: "One-command install", icon: PackageCheck },
  { label: "Editable TypeScript", icon: Braces },
  { label: "Bring your own keys", icon: KeyRound },
  { label: "No hosted runtime", icon: ServerOff },
]

export function ProductProofStrip() {
  return (
    <section
      className="border-y border-border/60 bg-muted/15"
      aria-label="AgentCN product guarantees"
    >
      <div className="container mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-border/60 px-4 sm:grid-cols-4 sm:divide-y-0">
        {proofPoints.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className={cn(
              "group relative flex items-center justify-center gap-2.5 px-3 py-4 text-center text-xs text-muted-foreground md:py-5",
              "transition-colors duration-300 ease-out hover:bg-foreground/[0.035]"
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-3 bottom-0 h-px origin-center scale-x-0 bg-primary/50 transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md",
                "bg-transparent ring-1 ring-transparent transition-all duration-300",
                "group-hover:bg-foreground/5 group-hover:ring-border/50"
              )}
            >
              <Icon
                className={cn(
                  "size-3.5 text-foreground/60 transition-all duration-300",
                  "group-hover:scale-105 group-hover:text-foreground"
                )}
              />
            </span>
            <span className="transition-colors duration-300 group-hover:text-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

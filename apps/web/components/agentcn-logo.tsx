import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

/** AgentCN wordmark mark — stylized "ai" monogram */
export function AgentcnLogo({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d="M7.5 21.5C7.5 12.8 13.2 7.5 19.8 10.6C24.2 12.8 25.8 18.8 23.4 23.6C21.8 26.6 18.4 28.2 14.6 27.8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.2 9.8L25.4 22.2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="23.4" cy="6.8" r="2.1" fill="currentColor" />
    </svg>
  )
}

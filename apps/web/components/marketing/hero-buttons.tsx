"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { GOAL_NAMES, useDataFast } from "@/lib/datafast-client"
import { Button } from "@/components/ui/button"

export function HeroButtons() {
  const { track } = useDataFast()

  const handleGetStartedClick = () => {
    track(GOAL_NAMES.DOCS_CLICKED_HERO)
  }

  const handleGithubClick = () => {
    track(GOAL_NAMES.GITHUB_CLICKED_HERO)
  }

  return (
    <>
      <Button
        asChild
        size="lg"
        variant="default"
        className="bg-foreground hover:bg-foreground/90 text-background rounded-xl px-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]"
      >
        <Link href="/docs" onClick={handleGetStartedClick}>
          Get started
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="hero"
        className="rounded-xl px-5 backdrop-blur-sm"
      >
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center text-sm"
          onClick={handleGithubClick}
        >
          View on GitHub
          <ExternalLink strokeWidth={1.5} className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100" />
        </Link>
      </Button>
    </>
  )
}

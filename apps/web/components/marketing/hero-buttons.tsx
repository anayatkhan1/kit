"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { GOAL_NAMES, useDataFast } from "@/lib/datafast-client"
import { Button } from "@/components/ui/button"

export function HeroButtons() {
  const { track } = useDataFast()

  const handleGetStartedClick = () => {
    track(GOAL_NAMES.PRICING_CLICKED_HERO)
  }

  const handleGithubClick = () => {
    track("clicked_github_from_hero")
  }

  return (
    <>
      <Button
        asChild
        size="lg"
        variant="default"
        className="bg-foreground hover:bg-foreground/90 text-background rounded-lg px-4"
      >
        <Link href="/docs" onClick={handleGetStartedClick}>
          Read the docs
        </Link>
      </Button>
      <Button asChild size="lg" variant="hero" className="rounded-lg px-4">
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center text-sm"
          onClick={handleGithubClick}
        >
          View on GitHub
          <ExternalLink strokeWidth={1.5} className="size-3.5" />
        </Link>
      </Button>
    </>
  )
}

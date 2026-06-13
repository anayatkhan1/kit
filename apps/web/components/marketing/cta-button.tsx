"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export function CTAButton() {
  return (
    <Button
      asChild
      size="lg"
      variant="default"
      className="bg-foreground hover:bg-foreground/90 text-background mt-8 h-10 rounded-lg px-4"
    >
      <Link
        href="/docs"
        onClick={() => {
          if (typeof window !== "undefined" && window.datafast) {
            window.datafast("clicked_get_started_from_cta")
          }
        }}
      >
        Browse the docs
      </Link>
    </Button>
  )
}

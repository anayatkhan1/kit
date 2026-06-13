"use client"

import Link from "next/link"
import { ExternalLink, ExternalLinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface LiveDemo {
  title: string
  href: string
}

interface TemplatesActionButtonsProps {
  liveDemos?: LiveDemo[]
  githubUrl?: string
}

export function TemplatesActionButtons({
  liveDemos = [],
  githubUrl,
}: TemplatesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-row flex-wrap gap-3">
      {githubUrl ? (
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && window.datafast) {
              window.datafast("clicked_template_github")
            }
          }}
        >
          <Button variant="gradient" className="h-8 w-fit text-[13.5px]">
            View on GitHub <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      ) : null}

      {liveDemos.map((demo, index) => (
        <Link
          key={index}
          href={demo.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof window !== "undefined" && window.datafast) {
              window.datafast("clicked_live_demo")
            }
          }}
        >
          <Button variant="outline" className="h-8 [&_svg]:size-3.5">
            <ExternalLinkIcon />
            {demo.title}
          </Button>
        </Link>
      ))}
    </div>
  )
}

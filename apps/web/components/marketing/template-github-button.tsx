"use client"

import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function TemplateGithubButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (typeof window !== "undefined" && window.datafast) {
          window.datafast("clicked_template_github")
        }
      }}
    >
      <Button variant="gradient" className="h-9 w-fit text-[13.5px]">
        <Github className="h-3.5 w-3.5" />
        View on GitHub
      </Button>
    </Link>
  )
}

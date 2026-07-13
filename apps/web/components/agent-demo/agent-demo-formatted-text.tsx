"use client"

import Link from "next/link"
import type { ReactNode } from "react"

type InlineNode =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; label: string; href: string }

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, match.index) })
    }

    const token = match[0]
    if (token.startsWith("**")) {
      nodes.push({ type: "bold", value: token.slice(2, -2) })
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push({
          type: "link",
          label: linkMatch[1],
          href: linkMatch[2],
        })
      } else {
        nodes.push({ type: "text", value: token })
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", value: text.slice(lastIndex) })
  }

  return nodes.length > 0 ? nodes : [{ type: "text", value: text }]
}

function InlineContent({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((node, index) => {
        if (node.type === "bold") {
          return (
            <strong key={index} className="text-foreground font-medium">
              {node.value}
            </strong>
          )
        }

        if (node.type === "link") {
          return (
            <Link
              key={index}
              href={node.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              {node.label}
            </Link>
          )
        }

        return <span key={index}>{node.value}</span>
      })}
    </>
  )
}

export function AgentDemoFormattedText({ text }: { text: string }) {
  const lines = text.split("\n")
  const blocks: ReactNode[] = []
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length === 0) return
    blocks.push(
      <ul key={`list-${blocks.length}`} className="space-y-2 pl-1">
        {listItems.map((item, index) => (
          <li key={index} className="flex gap-2 leading-relaxed">
            <span className="text-muted-foreground mt-0.5 shrink-0">•</span>
            <span>
              <InlineContent text={item} />
            </span>
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      continue
    }

    if (trimmed.startsWith("•")) {
      listItems.push(trimmed.replace(/^•\s*/, ""))
      continue
    }

    flushList()
    blocks.push(
      <p key={`p-${blocks.length}`} className="leading-relaxed">
        <InlineContent text={trimmed} />
      </p>
    )
  }

  flushList()

  return <div className="space-y-3 text-sm">{blocks}</div>
}

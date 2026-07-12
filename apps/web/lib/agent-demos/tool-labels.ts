import type { DemoMessagePart, DemoToolPart } from "@/lib/agent-demos/types"

function queryInput(input: Record<string, string>) {
  return input.query ?? "unknown"
}

function questionInput(input: Record<string, string>) {
  return input.question ?? "unknown"
}

function taskInput(input: Record<string, string>) {
  return input.task_name ?? input.task ?? "unknown"
}

const toolLabelFormatters: Record<
  DemoToolPart["tool"],
  (part: DemoToolPart) => string
> = {
  web_search: (part) => `Web search: ${queryInput(part.input)}`,
  answer_question: (part) => `Answer question: ${questionInput(part.input)}`,
  deep_research: (part) => `Deep research: ${taskInput(part.input)}`,
  use_browser: (part) => `Use browser: ${taskInput(part.input)}`,
  create_webset: (part) => `Create webset: ${taskInput(part.input)}`,
}

export function getDemoToolLabel(part: DemoToolPart): string {
  return toolLabelFormatters[part.tool](part)
}

export function getDemoText(parts: DemoMessagePart[]): string {
  return parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
}

export function getDemoToolParts(parts: DemoMessagePart[]): DemoToolPart[] {
  return parts.filter((part): part is DemoToolPart => part.type === "tool")
}

export function getDemoBrowserViews(parts: DemoMessagePart[]) {
  return parts.filter(
    (part): part is Extract<DemoMessagePart, { type: "browser_view" }> =>
      part.type === "browser_view"
  )
}

export function getDemoWebsetViews(parts: DemoMessagePart[]) {
  return parts.filter(
    (part): part is Extract<DemoMessagePart, { type: "webset_view" }> =>
      part.type === "webset_view"
  )
}

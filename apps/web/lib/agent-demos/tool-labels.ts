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

function fileInput(input: Record<string, string>) {
  return input.file_path ?? "unknown"
}

function storeInput(input: Record<string, string>) {
  return input.store_url ?? input.product_url ?? "unknown"
}

function catalogInput(input: Record<string, string>) {
  return input.catalog_name ?? "unknown"
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
  get_document_metadata: (part) =>
    `Document metadata: ${fileInput(part.input)}`,
  document_information_extraction: (part) =>
    `Extract PDF: ${fileInput(part.input)}`,
  get_sheet_metadata: (part) => `Sheet metadata: ${fileInput(part.input)}`,
  spreadsheet_information_extraction: (part) =>
    `Extract sheet: ${fileInput(part.input)}`,
  image_information_extraction: (part) =>
    `Extract image: ${fileInput(part.input)}`,
  save_extraction: (part) => `Save extraction: ${taskInput(part.input)}`,
  map_store: (part) => `Map store: ${storeInput(part.input)}`,
  discover_products: (part) =>
    `Discover products: ${part.input.listing_url ?? storeInput(part.input)}`,
  infer_product_schema: (part) =>
    `Infer product schema: ${storeInput(part.input)}`,
  extract_products: (part) =>
    `Extract products: ${part.input.urls ?? "urls"}`,
  save_catalog: (part) => `Save catalog: ${catalogInput(part.input)}`,
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

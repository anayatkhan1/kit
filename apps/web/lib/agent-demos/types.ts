export type DemoToolName =
  | "web_search"
  | "answer_question"
  | "deep_research"
  | "use_browser"
  | "create_webset"
  | "get_document_metadata"
  | "document_information_extraction"
  | "get_sheet_metadata"
  | "spreadsheet_information_extraction"
  | "image_information_extraction"
  | "save_extraction"

export type DemoToolPart = {
  type: "tool"
  tool: DemoToolName
  input: Record<string, string>
}

export type DemoTextPart = {
  type: "text"
  text: string
}

export type DemoBrowserViewPart = {
  type: "browser_view"
  url: string
  pageTitle: string
  provider: "Anchor Browser"
  navigationSteps: string[]
  pageContent: Array<{
    heading: string
    detail: string
  }>
}

export type DemoWebsetViewPart = {
  type: "webset_view"
  title: string
  provider: "Exa Websets"
  entityCount: number
  columns: string[]
  rows: string[][]
}

export type DemoMessagePart =
  | DemoToolPart
  | DemoTextPart
  | DemoBrowserViewPart
  | DemoWebsetViewPart

export type AgentDemoScenario = {
  id: string
  label: string
  prompt: string
  assistantParts: DemoMessagePart[]
}

export type AgentDemoConfig = {
  agentId: string
  label: string
  description: string
  defaultScenarioId: string
  scenarios: AgentDemoScenario[]
}

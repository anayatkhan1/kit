export type DemoToolName =
  | "web_search"
  | "answer_question"
  | "deep_research"
  | "use_browser"
  | "create_webset"

export type DemoToolPart = {
  type: "tool"
  tool: DemoToolName
  input: Record<string, string>
}

export type DemoTextPart = {
  type: "text"
  text: string
}

export type DemoMessagePart = DemoToolPart | DemoTextPart

export type AgentDemoScenario = {
  id: string
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

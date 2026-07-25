/**
 * Agent docs demo registry.
 *
 * To add a new agent demo:
 * 1. Add the agent to registry/registry-agents.ts
 * 2. Create apps/web/lib/agent-demos/{agent-id}.ts with a default scenario
 * 3. Register it in agentDemos below
 * 4. Add docs MDX: <AgentDemoPreview agentId="{agent-id}" />
 */

import type { AgentDemoConfig } from "./types"
import { extractionAgentDemo } from "./extraction-agent"
import { webAgentDemo } from "./web-agent"

const agentDemos: Record<string, AgentDemoConfig> = {
  [webAgentDemo.agentId]: webAgentDemo,
  [extractionAgentDemo.agentId]: extractionAgentDemo,
}

export function getAgentDemo(agentId: string): AgentDemoConfig | undefined {
  return agentDemos[agentId]
}

export function getDefaultScenario(demo: AgentDemoConfig) {
  return getScenarioById(demo, demo.defaultScenarioId) ?? demo.scenarios[0]
}

export function getScenarioById(demo: AgentDemoConfig, scenarioId: string) {
  return demo.scenarios.find((s) => s.id === scenarioId)
}

export type { AgentDemoConfig, AgentDemoScenario, DemoMessagePart } from "./types"

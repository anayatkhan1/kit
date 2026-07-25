import "server-only";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT as EXTRACTION_AGENT_PROMPT } from "@kit-ai/agents/extraction/prompt";
import { extractionToolset } from "@kit-ai/agents/extraction/tools/toolset";
import { SYSTEM_PROMPT as WEB_AGENT_PROMPT } from "@kit-ai/agents/web/prompt";
import { webToolset } from "@kit-ai/agents/web/tools/toolset";
import { type ToolSet, stepCountIs } from "ai";
import { type AgentId } from "./agent-profiles";

export type AgentConfig = {
	id: AgentId;
	label: string;
	description: string;
	starterPrompt: string;
	env: string[];
	systemPrompt: string;
	model: ReturnType<typeof anthropic>;
	stopWhen: ReturnType<typeof stepCountIs>[];
	localTools: ToolSet;
};

export const agentRegistry: Record<AgentId, AgentConfig> = {
	"web-agent": {
		id: "web-agent",
		label: "Web Agent",
		description: "Uses web search, deep research, browser, and webset tools.",
		starterPrompt:
			"Find top AI coding agents launched this month with concise citations.",
		env: ["ANTHROPIC_API_KEY", "EXA_API_KEY", "ANCHOR_API_KEY"],
		systemPrompt: WEB_AGENT_PROMPT,
		model: anthropic("claude-sonnet-4-5-20250929"),
		stopWhen: [stepCountIs(20)],
		localTools: webToolset,
	},
	"extraction-agent": {
		id: "extraction-agent",
		label: "Extraction Agent",
		description:
			"Extracts facts from PDFs, spreadsheets, and images with citations.",
		starterPrompt:
			"Extract the invoice number, total due, and due date from invoices/acme.pdf. Cite pages.",
		env: ["ANTHROPIC_API_KEY"],
		systemPrompt: EXTRACTION_AGENT_PROMPT,
		model: anthropic("claude-sonnet-4-5-20250929"),
		stopWhen: [stepCountIs(25)],
		localTools: extractionToolset,
	},
};

export function getAgentConfig(agentId: string | undefined): AgentConfig {
	if (!agentId || !(agentId in agentRegistry)) {
		return agentRegistry["web-agent"];
	}

	return agentRegistry[agentId as AgentId];
}

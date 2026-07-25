export type AgentId = "web-agent" | "extraction-agent";

export type AgentProfile = {
	id: AgentId;
	label: string;
	description: string;
	starterPrompt: string;
	env: string[];
};

export const agentProfiles: Record<AgentId, AgentProfile> = {
	"web-agent": {
		id: "web-agent",
		label: "Web Agent",
		description: "Uses web search, deep research, browser, and webset tools.",
		starterPrompt:
			"Find top AI coding agents launched this month with concise citations.",
		env: ["ANTHROPIC_API_KEY", "EXA_API_KEY", "ANCHOR_API_KEY"],
	},
	"extraction-agent": {
		id: "extraction-agent",
		label: "Extraction Agent",
		description:
			"Extracts facts from PDFs, spreadsheets, and images with citations.",
		starterPrompt:
			"Extract the invoice number, total due, and due date from invoices/acme.pdf. Cite pages.",
		env: ["ANTHROPIC_API_KEY"],
	},
};

export const defaultAgentId: AgentId = "web-agent";

export type AgentId = "file-agent" | "web-agent";

export type AgentProfile = {
	id: AgentId;
	label: string;
	description: string;
	starterPrompt: string;
	env: string[];
};

export const agentProfiles: Record<AgentId, AgentProfile> = {
	"file-agent": {
		id: "file-agent",
		label: "File Agent",
		description: "Works with local files and optional GitHub MCP actions.",
		starterPrompt:
			"List markdown files, create a TODO note, and summarize what changed.",
		env: ["ANTHROPIC_API_KEY", "GITHUB_PERSONAL_ACCESS_TOKEN"],
	},
	"web-agent": {
		id: "web-agent",
		label: "Web Agent",
		description: "Uses web search, deep research, browser, and webset tools.",
		starterPrompt:
			"Find top AI coding agents launched this month with concise citations.",
		env: ["ANTHROPIC_API_KEY", "EXA_API_KEY", "ANCHOR_API_KEY"],
	},
};

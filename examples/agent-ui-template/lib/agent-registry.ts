import "server-only";
import { SYSTEM_PROMPT as FILE_AGENT_PROMPT } from "@/agents/file-agent/prompt";
import { SYSTEM_PROMPT as WEB_AGENT_PROMPT } from "@/agents/web/prompt";
import { webToolset } from "@/agents/web/tools/toolset";
import { fileSystemToolset } from "@/tools/file-system/toolset";
import { anthropic } from "@ai-sdk/anthropic";
import { experimental_createMCPClient as createMCPClient } from "ai";
import { type ToolSet, stepCountIs } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";
import { type AgentId } from "./agent-profiles";

type McpContext = {
	tools: ToolSet;
	close: () => Promise<void>;
};

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
	createMcpContext?: () => Promise<McpContext>;
};

async function createGithubMcpContext(): Promise<McpContext> {
	const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
	if (!token) {
		throw new Error(
			"GITHUB_PERSONAL_ACCESS_TOKEN is required for file-agent MCP mode.",
		);
	}

	const mcpClient = await createMCPClient({
		transport: new StdioMCPTransport({
			command: "docker",
			args: [
				"run",
				"-i",
				"--rm",
				"-e",
				"GITHUB_PERSONAL_ACCESS_TOKEN",
				"ghcr.io/github/github-mcp-server",
			],
			env: {
				GITHUB_PERSONAL_ACCESS_TOKEN: token,
			},
		}),
	});

	const tools = await mcpClient.tools();

	return {
		tools,
		close: async () => mcpClient.close(),
	};
}

export const agentRegistry: Record<AgentId, AgentConfig> = {
	"file-agent": {
		id: "file-agent",
		label: "File Agent",
		description: "Works with local files and optional GitHub MCP actions.",
		starterPrompt:
			"List markdown files, create a TODO note, and summarize what changed.",
		env: ["ANTHROPIC_API_KEY", "GITHUB_PERSONAL_ACCESS_TOKEN"],
		systemPrompt: `You are a helpful assistant for file operations and GitHub tasks.\n${FILE_AGENT_PROMPT}`,
		model: anthropic("claude-sonnet-4-5-20250929"),
		stopWhen: [stepCountIs(10)],
		localTools: fileSystemToolset,
		createMcpContext: createGithubMcpContext,
	},
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
};

export function getAgentConfig(agentId: string | undefined): AgentConfig {
	if (!agentId || !(agentId in agentRegistry)) {
		return agentRegistry["file-agent"];
	}

	return agentRegistry[agentId as AgentId];
}

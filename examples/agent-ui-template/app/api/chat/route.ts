import { getAgentConfig } from "@/lib/agent-registry";
import {
	type ModelMessage,
	type UIMessage,
	convertToModelMessages,
	streamText,
} from "ai";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const messages: UIMessage[] = body.messages;
		const agentId: string | undefined =
			body.agentId ?? request.nextUrl.searchParams.get("agentId") ?? undefined;
		const modelMessages: ModelMessage[] = convertToModelMessages(messages);
		const selectedAgent = getAgentConfig(agentId);
		let cleanup: (() => Promise<void>) | undefined;
		let mcpTools = {};

		if (selectedAgent.createMcpContext) {
			const mcpContext = await selectedAgent.createMcpContext();
			cleanup = mcpContext.close;
			mcpTools = mcpContext.tools;
		}

		const result = streamText({
			model: selectedAgent.model,
			messages: modelMessages,
			system: selectedAgent.systemPrompt,
			tools: {
				...mcpTools,
				...selectedAgent.localTools,
			},
			stopWhen: selectedAgent.stopWhen,
		});

		return result.toUIMessageStreamResponse({
			onFinish: async () => {
				if (cleanup) {
					await cleanup();
				}
			},
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown server error.";
		return Response.json(
			{
				error: message,
				hint: "If using file-agent with MCP, ensure Docker is running and GITHUB_PERSONAL_ACCESS_TOKEN is set.",
			},
			{ status: 500 },
		);
	}
}

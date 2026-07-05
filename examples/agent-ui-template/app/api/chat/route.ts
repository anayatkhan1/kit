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
		const modelMessages: ModelMessage[] =
			await convertToModelMessages(messages);
		const selectedAgent = getAgentConfig(agentId);

		const result = streamText({
			model: selectedAgent.model,
			messages: modelMessages,
			system: selectedAgent.systemPrompt,
			tools: selectedAgent.localTools,
			stopWhen: selectedAgent.stopWhen,
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown server error.";
		return Response.json({ error: message }, { status: 500 });
	}
}

import { anthropic } from "@ai-sdk/anthropic";
import { type ModelMessage, stepCountIs, streamText } from "ai";
import { SYSTEM_PROMPT } from "./prompt";
import { webToolset } from "./tools";

export function webAgent(messages: ModelMessage[]) {
	return streamText({
		model: anthropic("claude-sonnet-4-5-20250929"),
		system: SYSTEM_PROMPT,
		messages,
		tools: webToolset,
		stopWhen: [stepCountIs(20)],
	});
}

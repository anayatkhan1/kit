import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type ModelMessage, stepCountIs } from "ai";
import { SYSTEM_PROMPT } from "./prompt";
import { extractionToolset } from "./tools";

export function extractionAgent(messages: ModelMessage[]) {
  return streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    messages,
    tools: extractionToolset,
    stopWhen: [stepCountIs(25)],
  });
}

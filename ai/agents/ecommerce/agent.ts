import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type ModelMessage, stepCountIs } from "ai";
import { SYSTEM_PROMPT } from "./prompt";
import { ecommerceToolset } from "./tools";

export function ecommerceAgent(messages: ModelMessage[]) {
  return streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    messages,
    tools: ecommerceToolset,
    stopWhen: [stepCountIs(25)],
  });
}

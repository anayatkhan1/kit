import { tool } from "ai";
import { getExaClient } from "./core";
import { answerQuestionSchema } from "./schema";

export const answerQuestionTool = tool({
  description: "Answer a question using web sources.",
  inputSchema: answerQuestionSchema,
  execute: async ({ question, output_schema }, { toolCallId }) => {
    const exa = getExaClient();
    const response = await exa.answer(question, {
      outputSchema: output_schema ? JSON.parse(output_schema) : undefined,
    });

    console.log({
      type: "exa.answer",
      tool_call_id: toolCallId,
      request_id: response.requestId,
      cost_dollars: response.costDollars,
    });

    return {
      success: true,
      answer: response.answer,
      citations: response.citations,
    };
  },
});

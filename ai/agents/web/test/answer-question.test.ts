import { expect, it, jest } from "@jest/globals";
import { answerQuestionTool } from "../tools/answer-question";
import { describeIfExa } from "./test-helpers";

const toolOptions = { toolCallId: "jest-answer-question", messages: [] };

describeIfExa("answerQuestionTool", () => {
  // Exa calls can take longer than Jest's 5s default.
  jest.setTimeout(30_000);

  it("returns an answer with citations", async () => {
    const result = await answerQuestionTool.execute!(
      {
        question: "What is the capital of France?",
      },
      toolOptions
    );

    expect(result).toMatchObject({ success: true });
    expect(typeof (result as { answer?: unknown }).answer).toBe("string");
  });
});

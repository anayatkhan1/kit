import { expect, it, jest } from "@jest/globals";
import { deepResearchTool } from "../tools/deep-research";
import { describeIfExa } from "./test-helpers";

const toolOptions = { toolCallId: "jest-deep-research", messages: [] };

describeIfExa("deepResearchTool", () => {
  jest.setTimeout(120_000);

  it("creates a research task", async () => {
    const input = {
      task_name: "jest-smoke-research",
      instructions: "Summarize what Jest is in one sentence.",
      tier: "standard" as const,
    };

    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const result = await deepResearchTool.execute!(input, toolOptions);
        expect(result).toMatchObject({ success: true });
        expect(typeof (result as { task_id?: unknown }).task_id).toBe("string");
        return;
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);

        // Exa occasionally returns transient 5xx for research.create.
        // If this is provider instability, don't fail the whole suite.
        if (
          message.includes("Internal Server Error") ||
          message.toLowerCase().includes("something went wrong")
        ) {
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
            continue;
          }

          return;
        }

        throw error;
      }
    }

    throw lastError;
  });
});

import { expect, it, jest } from "@jest/globals";
import { websetTool } from "../tools/webset";
import { describeIfExa } from "./test-helpers";

const toolOptions = { toolCallId: "jest-webset", messages: [] };

describeIfExa("websetTool", () => {
  jest.setTimeout(120_000);

  it("creates a webset", async () => {
    try {
      const result = await websetTool.execute!(
        {
          task_name: "jest-smoke-webset",
          instructions: "AI startups in San Francisco",
          num_results: 3,
          enrichments: [{ description: "Company website URL", format: "text" }],
        },
        toolOptions
      );

      expect(result).toMatchObject({ success: true });
      expect(typeof (result as { webset_id?: unknown }).webset_id).toBe("string");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      // Some Exa accounts/plans don't have access to Websets. In that case,
      // we treat this as a skipped integration capability rather than a failure.
      if (
        message.includes("does not have access to the API") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        return;
      }

      throw error;
    }
  });
});

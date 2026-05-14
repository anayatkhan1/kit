import { expect, it, jest } from "@jest/globals";
import { webSearchTool } from "../tools/web-search";
import { describeIfExa } from "./test-helpers";

const toolOptions = { toolCallId: "jest-web-search", messages: [] };

describeIfExa("webSearchTool", () => {
  // Exa calls can take longer than Jest's 5s default.
  jest.setTimeout(30_000);

  it("returns search results", async () => {
    const result = await webSearchTool.execute!(
      {
        query: "TypeScript programming language",
        allow_cached_results: true,
        num_results: 2,
      },
      toolOptions
    );

    expect(result).toMatchObject({ success: true });
    expect(Array.isArray((result as { content?: unknown }).content)).toBe(true);
  });
});

import { expect, it, jest } from "@jest/globals";
import { useBrowserTool } from "../tools/use-browser";
import { describeIfAnchor } from "./test-helpers";

const toolOptions = { toolCallId: "jest-use-browser", messages: [] };

describeIfAnchor("useBrowserTool", () => {
  jest.setTimeout(180_000);

  it("runs a minimal browser task", async () => {
    const result = await useBrowserTool.execute!(
      {
        task: "Return the visible title text of the page.",
        initialUrl: "https://example.com",
      },
      toolOptions
    );

    expect(result).toHaveProperty("success");
    if ((result as { success: boolean }).success) {
      expect(result).toHaveProperty("result");
    }
  });
});

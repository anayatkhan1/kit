import { tool } from "ai";
import { buildTaskMetadata, writeWorkspaceFile } from "./core";
import { saveExtractionSchema } from "./schema";

export const saveExtractionTool = tool({
  description:
    "Save extraction results as markdown or JSON under data/extraction-agent.local.",
  inputSchema: saveExtractionSchema,
  execute: async ({ task_name, format, content }) => {
    const meta = buildTaskMetadata(task_name);
    const extension = format === "json" ? "json" : "md";
    const relativePath = `${meta.task_name}/${meta.task_name}.${extension}`;

    if (format === "json") {
      try {
        JSON.parse(content);
      } catch {
        throw new Error("content must be valid JSON when format is json.");
      }
    }

    const savedPath = writeWorkspaceFile(relativePath, content);

    return {
      success: true,
      content: {
        path: savedPath,
        format,
        task_name: meta.task_name,
        created_at: meta.created_at,
      },
    };
  },
});

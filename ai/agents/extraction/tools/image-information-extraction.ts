import { anthropic } from "@ai-sdk/anthropic";
import { generateText, tool } from "ai";
import { getImageMediaType, readWorkspaceFile } from "./core";
import { imageInformationExtractionSchema } from "./schema";

export const imageInformationExtractionTool = tool({
  description:
    "Extract text and facts from an image (png, jpg, jpeg, webp, gif).",
  inputSchema: imageInformationExtractionSchema,
  execute: async ({ file_path, instructions, include_citations }) => {
    const mediaType = getImageMediaType(file_path);
    const image = readWorkspaceFile(file_path);

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      maxOutputTokens: 4096,
      system: include_citations
        ? `You extract information from images. Cite the source file path (${file_path}) when stating extracted facts.`
        : "You extract information from images according to the user's instructions.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instructions },
            { type: "image", image, mediaType },
          ],
        },
      ],
    });

    return {
      success: true,
      content: {
        file_path,
        result: text,
      },
    };
  },
});

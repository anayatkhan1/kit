import { anthropic } from "@ai-sdk/anthropic";
import { generateText, tool } from "ai";
import { PDFDocument } from "pdf-lib";
import { extractPdfPages, readWorkspaceFile } from "./core";
import { documentInformationExtractionSchema } from "./schema";

export const documentInformationExtractionTool = tool({
  description:
    "Extract information from a PDF with optional page range and citations.",
  inputSchema: documentInformationExtractionSchema,
  execute: async ({
    file_path,
    instructions,
    include_citations,
    page_range,
  }) => {
    if (!file_path.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are supported for document extraction.");
    }

    const buffer = readWorkspaceFile(file_path);
    const document = await PDFDocument.load(buffer);
    const totalPages = document.getPageCount();

    if (page_range?.end && !page_range.start) {
      throw new Error("Start page is required when end page is provided.");
    }

    const finalDocument = page_range?.start
      ? await extractPdfPages(
          document,
          page_range.start,
          page_range.end ?? totalPages
        )
      : document;

    const documentBuffer = Buffer.from(await finalDocument.save());

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      maxOutputTokens: 8192,
      system: include_citations
        ? "You extract information from PDF documents. For every claim, include a citation with page number and an exact snippet from the document when possible."
        : "You extract information from PDF documents according to the user's instructions.",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instructions },
            {
              type: "file",
              data: documentBuffer,
              mediaType: "application/pdf",
            },
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

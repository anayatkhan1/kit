import { tool } from "ai";
import { PDFDocument } from "pdf-lib";
import { readWorkspaceFile } from "./core";
import { getDocumentMetadataSchema } from "./schema";

async function tryOrNull<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export const getDocumentMetadataTool = tool({
  description:
    "Get metadata for a PDF (page count, title, author, creator, subject).",
  inputSchema: getDocumentMetadataSchema,
  execute: async ({ file_path }) => {
    if (!file_path.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are supported for document metadata.");
    }

    const buffer = readWorkspaceFile(file_path);
    const document = await PDFDocument.load(buffer);

    return {
      success: true,
      content: {
        page_count: document.getPageCount(),
        title: await tryOrNull(async () => document.getTitle()),
        author: await tryOrNull(async () => document.getAuthor()),
        creator: await tryOrNull(async () => document.getCreator()),
        producer: await tryOrNull(async () => document.getProducer()),
        subject: await tryOrNull(async () => document.getSubject()),
        keywords: await tryOrNull(async () => document.getKeywords()),
        creationDate: (
          await tryOrNull(async () => document.getCreationDate())
        )?.toISOString(),
      },
    };
  },
});

import { z } from "zod";

const getDocumentMetadataSchema = z.object({
  file_path: z
    .string()
    .describe(
      "Relative path to a PDF inside the extraction workspace (data/extraction-agent.local)."
    ),
});

const documentInformationExtractionSchema = z.object({
  file_path: z
    .string()
    .describe("Relative path to a PDF inside the extraction workspace."),
  instructions: z
    .string()
    .describe("What information to extract from the document."),
  include_citations: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include page citations. Prefer true unless asked otherwise."),
  page_range: z
    .object({
      start: z.number().int().min(1).describe("Start page (1-indexed)."),
      end: z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("End page (1-indexed). Defaults to last page."),
    })
    .optional()
    .describe("Optional page range. Omit to analyze the full PDF."),
});

const getSheetMetadataSchema = z.object({
  file_path: z
    .string()
    .describe(
      "Relative path to an xlsx, xls, or csv file inside the extraction workspace."
    ),
});

const spreadsheetInformationExtractionSchema = z.object({
  file_path: z
    .string()
    .describe("Relative path to an xlsx, xls, or csv file."),
  instructions: z
    .string()
    .describe("What information to extract from the spreadsheet."),
  include_citations: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include sheet/cell citations. Prefer true."),
  sheet_names: z
    .array(z.string())
    .optional()
    .describe("Specific sheet names. Omit to analyze all sheets."),
  cell_range: z
    .string()
    .optional()
    .describe("Optional cell range such as A1:D10."),
});

const imageInformationExtractionSchema = z.object({
  file_path: z
    .string()
    .describe(
      "Relative path to a png, jpg, jpeg, webp, or gif inside the extraction workspace."
    ),
  instructions: z
    .string()
    .describe("What information to extract from the image."),
  include_citations: z
    .boolean()
    .optional()
    .default(true)
    .describe("Mention the source file when citing extracted text."),
});

const saveExtractionSchema = z.object({
  task_name: z
    .string()
    .describe("Short task name used for the output folder/file."),
  format: z
    .enum(["markdown", "json"])
    .optional()
    .default("markdown")
    .describe("Output format."),
  content: z
    .string()
    .describe("Extraction result to persist (markdown text or JSON string)."),
});

export {
  getDocumentMetadataSchema,
  documentInformationExtractionSchema,
  getSheetMetadataSchema,
  spreadsheetInformationExtractionSchema,
  imageInformationExtractionSchema,
  saveExtractionSchema,
};

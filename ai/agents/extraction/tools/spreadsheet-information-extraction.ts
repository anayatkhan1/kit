import { anthropic } from "@ai-sdk/anthropic";
import { generateText, tool } from "ai";
import * as XLSX from "xlsx";
import { readWorkspaceFile } from "./core";
import { spreadsheetInformationExtractionSchema } from "./schema";

const LARGE_SHEET_CELL_THRESHOLD = 4000;

export const spreadsheetInformationExtractionTool = tool({
  description:
    "Extract information from an xlsx, xls, or csv spreadsheet with cell citations.",
  inputSchema: spreadsheetInformationExtractionSchema,
  execute: async ({
    file_path,
    instructions,
    include_citations,
    sheet_names,
    cell_range,
  }) => {
    const lower = file_path.toLowerCase();
    if (
      !lower.endsWith(".xlsx") &&
      !lower.endsWith(".xls") &&
      !lower.endsWith(".csv")
    ) {
      throw new Error("File must be .xlsx, .xls, or .csv.");
    }

    const buffer = readWorkspaceFile(file_path);
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellFormula: true,
      cellStyles: true,
      sheetStubs: true,
    });

    const sheetsToAnalyze = sheet_names?.length
      ? sheet_names
      : workbook.SheetNames;

    let totalCells = 0;
    const sheetSizes: {
      name: string;
      rows: number;
      columns: number;
      cells: number;
    }[] = [];

    for (const sheetName of sheetsToAnalyze) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      let rows = range.e.r - range.s.r + 1;
      let columns = range.e.c - range.s.c + 1;

      if (cell_range) {
        try {
          const customRange = XLSX.utils.decode_range(cell_range);
          rows = customRange.e.r - customRange.s.r + 1;
          columns = customRange.e.c - customRange.s.c + 1;
        } catch {
          // keep full sheet size
        }
      }

      const cells = rows * columns;
      totalCells += cells;
      sheetSizes.push({ name: sheetName, rows, columns, cells });
    }

    if (totalCells > LARGE_SHEET_CELL_THRESHOLD) {
      return {
        success: false,
        content: {
          analysis_method: "range_required" as const,
          result: `Spreadsheet is too large for a single pass (${totalCells.toLocaleString()} cells; limit ${LARGE_SHEET_CELL_THRESHOLD.toLocaleString()}).

Sheet sizes:
${sheetSizes
  .map(
    (s) =>
      `- ${s.name}: ${s.rows} rows × ${s.columns} columns (${s.cells.toLocaleString()} cells)`
  )
  .join("\n")}

Call this tool again with sheet_names and/or a smaller cell_range (e.g. A1:F100).`,
        },
      };
    }

    const sheetsData: { name: string; data: string }[] = [];
    for (const sheetName of sheetsToAnalyze) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const csvData = XLSX.utils.sheet_to_csv(worksheet, {
        ...(cell_range ? { range: cell_range } : {}),
        forceQuotes: true,
      });

      sheetsData.push({ name: sheetName, data: csvData });
    }

    let systemPrompt =
      "You extract information from spreadsheet data provided as CSV. Follow the user's instructions carefully.";
    if (include_citations) {
      systemPrompt +=
        " For every claim, cite sheet name and cell reference (e.g. Sheet1!A5) with the exact cell value when possible.";
    }

    let dataContent = "Spreadsheet data:\n\n";
    for (const sheet of sheetsData) {
      dataContent += `=== Sheet: ${sheet.name} ===\n${sheet.data}\n\n`;
    }

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      maxOutputTokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instructions },
            { type: "text", text: dataContent },
          ],
        },
      ],
    });

    return {
      success: true,
      content: {
        file_path,
        analysis_method: "direct" as const,
        result: text,
      },
    };
  },
});

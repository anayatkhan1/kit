import { tool } from "ai";
import * as XLSX from "xlsx";
import { readWorkspaceFile } from "./core";
import { getSheetMetadataSchema } from "./schema";

export const getSheetMetadataTool = tool({
  description:
    "Get metadata for a spreadsheet (sheet names, dimensions, formulas, filters).",
  inputSchema: getSheetMetadataSchema,
  execute: async ({ file_path }) => {
    const lower = file_path.toLowerCase();
    if (
      !lower.endsWith(".xlsx") &&
      !lower.endsWith(".xls") &&
      !lower.endsWith(".csv")
    ) {
      throw new Error("File must be .xlsx, .xls, or .csv.");
    }

    const buffer = readWorkspaceFile(file_path);
    const fileFormat = lower.endsWith(".csv")
      ? "csv"
      : lower.endsWith(".xls")
        ? "xls"
        : "xlsx";

    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellFormula: true,
      cellStyles: true,
      sheetStubs: true,
    });

    const sheets = workbook.SheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]!;
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      const rows = range.e.r - range.s.r + 1;
      const columns = range.e.c - range.s.c + 1;

      let isTabular = false;
      if (rows > 1 && columns > 1) {
        const firstRowCells: string[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
          const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c });
          const cell = worksheet[cellAddress];
          if (cell?.v) firstRowCells.push(String(cell.v));
        }
        isTabular = firstRowCells.length >= columns * 0.7;
      }

      let hasFormulas = false;
      let referencesOtherSheets = false;
      const hasFilters = Boolean(worksheet["!autofilter"]);

      Object.keys(worksheet).forEach((cellAddress) => {
        if (cellAddress[0] === "!") return;
        const cell = worksheet[cellAddress];
        if (cell?.f) {
          hasFormulas = true;
          if (cell.f.includes("!") || cell.f.includes("[")) {
            referencesOtherSheets = true;
          }
        }
      });

      return {
        name: sheetName,
        rows,
        columns,
        is_tabular: isTabular,
        has_formulas: hasFormulas,
        has_filters: hasFilters,
        references_other_sheets: referencesOtherSheets,
      };
    });

    return {
      success: true,
      content: {
        sheets,
        total_sheets: workbook.SheetNames.length,
        file_format: fileFormat,
      },
    };
  },
});

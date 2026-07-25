import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { PDFDocument } from "pdf-lib";
import * as XLSX from "xlsx";

const toolOptions = { toolCallId: "jest-extraction", messages: [] };

describe("extraction workspace helpers", () => {
  let tempRoot: string;
  let previousCwd: string;

  beforeEach(() => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "extraction-agent-"));
    process.chdir(tempRoot);
    jest.resetModules();
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("rejects path traversal outside the workspace", async () => {
    const { resolveWorkspacePath } = await import("../tools/core");
    expect(() => resolveWorkspacePath("../outside.txt")).toThrow(/Access denied/);
  });

  it("reads and writes files inside the workspace", async () => {
    const { writeWorkspaceFile, readWorkspaceFile } = await import(
      "../tools/core"
    );
    writeWorkspaceFile("notes/hello.txt", "hello");
    expect(readWorkspaceFile("notes/hello.txt").toString("utf8")).toBe("hello");
  });
});

describe("getDocumentMetadataTool", () => {
  let tempRoot: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "extraction-agent-"));
    process.chdir(tempRoot);
    jest.resetModules();

    const pdf = await PDFDocument.create();
    pdf.addPage();
    pdf.setTitle("Test Invoice");
    const bytes = await pdf.save();
    const dir = path.join(tempRoot, "data", "extraction-agent.local");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "invoice.pdf"), bytes);
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("returns PDF metadata", async () => {
    const { getDocumentMetadataTool } = await import(
      "../tools/get-document-metadata"
    );
    const result = await getDocumentMetadataTool.execute!(
      { file_path: "invoice.pdf" },
      toolOptions
    );

    expect(result).toMatchObject({
      success: true,
      content: {
        page_count: 1,
        title: "Test Invoice",
      },
    });
  });
});

describe("getSheetMetadataTool", () => {
  let tempRoot: string;
  let previousCwd: string;

  beforeEach(() => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "extraction-agent-"));
    process.chdir(tempRoot);
    jest.resetModules();

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Name", "Amount"],
      ["Acme", 100],
      ["Beta", 250],
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Sales");
    const dir = path.join(tempRoot, "data", "extraction-agent.local");
    fs.mkdirSync(dir, { recursive: true });
    XLSX.writeFile(workbook, path.join(dir, "sales.xlsx"));
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("returns spreadsheet metadata", async () => {
    const { getSheetMetadataTool } = await import("../tools/get-sheet-metadata");
    const result = await getSheetMetadataTool.execute!(
      { file_path: "sales.xlsx" },
      toolOptions
    );

    expect(result).toMatchObject({
      success: true,
      content: {
        total_sheets: 1,
        file_format: "xlsx",
      },
    });
    const content = (result as { content: { sheets: Array<{ name: string }> } })
      .content;
    expect(content.sheets[0]?.name).toBe("Sales");
  });
});

describe("saveExtractionTool", () => {
  let tempRoot: string;
  let previousCwd: string;

  beforeEach(() => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "extraction-agent-"));
    process.chdir(tempRoot);
    jest.resetModules();
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("saves markdown extraction output", async () => {
    const { saveExtractionTool } = await import("../tools/save-extraction");
    const result = await saveExtractionTool.execute!(
      {
        task_name: "Invoice Summary",
        format: "markdown",
        content: "# Total\n$100",
      },
      toolOptions
    );

    expect(result).toMatchObject({
      success: true,
      content: {
        format: "markdown",
        task_name: "invoice-summary",
      },
    });

    const saved = (result as { content: { path: string } }).content.path;
    const full = path.join(
      tempRoot,
      "data",
      "extraction-agent.local",
      saved
    );
    expect(fs.readFileSync(full, "utf8")).toContain("$100");
  });
});

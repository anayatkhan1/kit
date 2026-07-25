import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import {
  afterEach,
  beforeEach,
  expect,
  it,
  jest,
} from "@jest/globals";
import { PDFDocument } from "pdf-lib";
import { describeIfAnthropic } from "./test-helpers";

const toolOptions = { toolCallId: "jest-doc-extract", messages: [] };

describeIfAnthropic("document_information_extraction (live)", () => {
  jest.setTimeout(90_000);

  let tempRoot: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "extraction-agent-"));
    process.chdir(tempRoot);
    jest.resetModules();

    const pdf = await PDFDocument.create();
    pdf.addPage();
    pdf.setTitle("Invoice");
    const bytes = await pdf.save();
    const dir = path.join(tempRoot, "data", "extraction-agent.local");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "invoice.pdf"), bytes);
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("runs document extraction against a PDF", async () => {
    const { documentInformationExtractionTool } = await import(
      "../tools/document-information-extraction"
    );
    const result = await documentInformationExtractionTool.execute!(
      {
        file_path: "invoice.pdf",
        instructions: "Summarize what this PDF contains.",
        include_citations: true,
      },
      toolOptions
    );

    expect(result).toMatchObject({ success: true });
    expect(
      (result as { content: { result: string } }).content.result.length
    ).toBeGreaterThan(0);
  });
});

import type { AgentDemoConfig } from "./types"

export const extractionAgentDemo: AgentDemoConfig = {
  agentId: "extraction-agent",
  label: "Extraction Agent",
  description:
    "Extracts facts from PDFs, spreadsheets, and images with citations.",
  defaultScenarioId: "pdf",
  scenarios: [
    {
      id: "pdf",
      label: "PDF invoice",
      prompt:
        "Extract the vendor, total, and due date from invoices/acme.pdf with citations.",
      assistantParts: [
        {
          type: "tool",
          tool: "get_document_metadata",
          input: {
            file_path: "invoices/acme.pdf",
          },
        },
        {
          type: "tool",
          tool: "document_information_extraction",
          input: {
            file_path: "invoices/acme.pdf",
            instructions: "Extract vendor, total amount, and due date.",
          },
        },
        {
          type: "tool",
          tool: "save_extraction",
          input: {
            task_name: "acme-invoice",
            format: "markdown",
          },
        },
        {
          type: "text",
          text: `Extracted from **invoices/acme.pdf**:

• **Vendor** — Acme Supplies Co. (page 1)
• **Total** — $4,200.00 (page 2)
• **Due date** — August 15, 2026 (page 2)

Saved to \`acme-invoice/acme-invoice.md\`.`,
        },
      ],
    },
    {
      id: "sheet",
      label: "Spreadsheet",
      prompt: "Summarize Q2 revenue by region from sales/q2.xlsx.",
      assistantParts: [
        {
          type: "tool",
          tool: "get_sheet_metadata",
          input: {
            file_path: "sales/q2.xlsx",
          },
        },
        {
          type: "tool",
          tool: "spreadsheet_information_extraction",
          input: {
            file_path: "sales/q2.xlsx",
            instructions: "Summarize Q2 revenue by region with cell citations.",
          },
        },
        {
          type: "text",
          text: `Q2 revenue by region from **sales/q2.xlsx** (sheet Sales):

• **North** — $1.2M (Sales!B4)
• **EMEA** — $980K (Sales!B5)
• **APAC** — $745K (Sales!B6)

North led the quarter; APAC grew fastest week-over-week.`,
        },
      ],
    },
    {
      id: "image",
      label: "Receipt image",
      prompt: "Read the total and merchant from receipts/cafe.png.",
      assistantParts: [
        {
          type: "tool",
          tool: "image_information_extraction",
          input: {
            file_path: "receipts/cafe.png",
            instructions: "Extract merchant name and total amount.",
          },
        },
        {
          type: "text",
          text: `From **receipts/cafe.png**:

• **Merchant** — Harbor Cafe
• **Total** — $18.40

Tip and tax are itemized separately on the receipt.`,
        },
      ],
    },
  ],
}

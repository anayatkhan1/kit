import type { AgentDemoConfig } from "./types"

export const ecommerceAgentDemo: AgentDemoConfig = {
  agentId: "ecommerce-agent",
  label: "E-commerce Agent",
  description:
    "Maps stores and extracts product, pricing, and inventory data with Firecrawl.",
  defaultScenarioId: "catalog",
  scenarios: [
    {
      id: "catalog",
      label: "Catalog extraction",
      prompt:
        "Discover products on https://demo-shop.example/collections/all then extract title, price, and stock. Save as demo-catalog.",
      assistantParts: [
        {
          type: "tool",
          tool: "discover_products",
          input: {
            listing_url: "https://demo-shop.example/collections/all",
            limit: "20",
          },
        },
        {
          type: "tool",
          tool: "extract_products",
          input: {
            urls: "https://demo-shop.example/products/tee, https://demo-shop.example/products/hoodie",
          },
        },
        {
          type: "tool",
          tool: "save_catalog",
          input: {
            catalog_name: "demo-catalog",
            format: "json",
          },
        },
        {
          type: "text",
          text: `Found product links on the collection page and extracted 2 products:

• **Classic Tee** — $29 · in stock · [/products/tee](https://demo-shop.example/products/tee)
• **Zip Hoodie** — $68 · low stock · [/products/hoodie](https://demo-shop.example/products/hoodie)

Saved to \`catalogs/demo-catalog.json\`.`,
        },
      ],
    },
    {
      id: "pricing",
      label: "Price snapshot",
      prompt:
        "Extract current prices and availability from these competitor product URLs and save a snapshot.",
      assistantParts: [
        {
          type: "tool",
          tool: "infer_product_schema",
          input: {
            product_url: "https://competitor.example/products/widget",
          },
        },
        {
          type: "tool",
          tool: "extract_products",
          input: {
            urls: "https://competitor.example/products/widget",
          },
        },
        {
          type: "tool",
          tool: "save_catalog",
          input: {
            catalog_name: "price-snapshot",
            format: "json",
          },
        },
        {
          type: "text",
          text: `Price snapshot for **competitor.example**:

• **Widget Pro** — $149 (was $179) · in stock · SKU \`WP-100\`

Saved to \`catalogs/price-snapshot.json\`. Re-run this prompt later (or on a cron) to compare prices over time.`,
        },
      ],
    },
  ],
}

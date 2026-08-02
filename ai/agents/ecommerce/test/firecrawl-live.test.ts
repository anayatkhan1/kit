import { expect, it } from "@jest/globals";
import { describeIfFirecrawl } from "./test-helpers";

const toolOptions = { toolCallId: "jest-ecommerce-live", messages: [] };

describeIfFirecrawl("mapStoreTool (live Firecrawl)", () => {
  it("maps a public store and returns URLs", async () => {
    const { mapStoreTool } = await import("../tools/map-store");
    const result = await mapStoreTool.execute!(
      {
        store_url: "https://www.firecrawl.dev",
        limit: 10,
        include_subdomains: false,
        save_map: false,
      },
      toolOptions
    );

    expect(result).toMatchObject({
      success: true,
      content: {
        total: expect.any(Number),
      },
    });
    const content = (result as { content: { total: number } }).content;
    expect(content.total).toBeGreaterThanOrEqual(0);
  }, 60000);
});

describeIfFirecrawl("inferProductSchemaTool (live Firecrawl)", () => {
  it("returns a schema for a sample page", async () => {
    const { inferProductSchemaTool } = await import(
      "../tools/infer-product-schema"
    );
    const result = await inferProductSchemaTool.execute!(
      {
        product_url: "https://www.firecrawl.dev",
        use_default_schema: true,
        save_schema: false,
      },
      toolOptions
    );

    expect(result).toMatchObject({
      success: true,
      content: {
        source: "default",
        fields: expect.arrayContaining(["title", "price"]),
      },
    });
  }, 30000);
});

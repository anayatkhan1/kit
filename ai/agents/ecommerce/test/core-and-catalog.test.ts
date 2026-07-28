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

const toolOptions = { toolCallId: "jest-ecommerce", messages: [] };

describe("ecommerce workspace helpers", () => {
  let tempRoot: string;
  let previousCwd: string;

  beforeEach(() => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ecommerce-agent-"));
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

  it("writes artifacts under data/ecommerce-agent.local", async () => {
    const { saveArtifact } = await import("../tools/core");
    const saved = saveArtifact("maps", "demo-urls.json", { urls: ["https://x"] });
    expect(saved).toBe(path.join("maps", "demo-urls.json"));
    expect(
      fs.existsSync(
        path.join(tempRoot, "data", "ecommerce-agent.local", "maps", "demo-urls.json")
      )
    ).toBe(true);
  });

  it("classifies product and category URLs", async () => {
    const { classifyUrls, classifyStoreUrl } = await import("../tools/core");
    expect(classifyStoreUrl("https://shop.example/products/blue-shirt")).toBe(
      "product"
    );
    expect(classifyStoreUrl("https://shop.example/collections/summer")).toBe(
      "category"
    );
    expect(classifyStoreUrl("https://shop.example/cart")).toBe("other");

    const analysis = classifyUrls([
      "https://shop.example/products/a",
      "https://shop.example/products/b",
      "https://shop.example/collections/all",
      "https://shop.example/about",
    ]);
    expect(analysis.product_count).toBe(2);
    expect(analysis.category_count).toBe(1);
    expect(analysis.other_count).toBe(1);
  });

  it("infers commerce fields from sample content", async () => {
    const { inferProductSchemaFromContent, getDefaultProductSchema } =
      await import("../tools/core");
    const schema = inferProductSchemaFromContent(
      "Buy now for $29.99. SKU: ABC-123. In stock. Rating: 4.5 stars"
    );
    expect(schema.properties.price).toBeDefined();
    expect(schema.properties.sku).toBeDefined();
    expect(schema.properties.title).toBeDefined();
    expect(Object.keys(getDefaultProductSchema().properties).length).toBeGreaterThan(
      5
    );
  });

  it("converts products to CSV", async () => {
    const { productsToCsv } = await import("../tools/core");
    const csv = productsToCsv([
      { title: "Shirt", price: "$10", url: "https://x/1" },
      { title: 'Hat "Blue"', price: "$5", url: "https://x/2" },
    ]);
    expect(csv).toContain("title,price,url");
    expect(csv).toContain("Shirt");
    expect(csv).toContain('"Hat ""Blue"""');
  });

  it("throws a clear error when FIRECRAWL_API_KEY is missing", async () => {
    const previous = process.env.FIRECRAWL_API_KEY;
    delete process.env.FIRECRAWL_API_KEY;
    jest.resetModules();
    const { getFirecrawlClient } = await import("../tools/core");
    expect(() => getFirecrawlClient()).toThrow(/FIRECRAWL_API_KEY/);
    if (previous !== undefined) process.env.FIRECRAWL_API_KEY = previous;
  });
});

describe("saveCatalogTool", () => {
  let tempRoot: string;
  let previousCwd: string;

  beforeEach(() => {
    previousCwd = process.cwd();
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ecommerce-agent-"));
    process.chdir(tempRoot);
    jest.resetModules();
  });

  afterEach(() => {
    process.chdir(previousCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("saves a JSON catalog", async () => {
    const { saveCatalogTool } = await import("../tools/save-catalog");
    const result = await saveCatalogTool.execute!(
      {
        catalog_name: "Demo Catalog",
        products: [{ title: "Widget", price: "$9", url: "https://shop/p/1" }],
        format: "json",
      },
      toolOptions
    );

    expect(result).toMatchObject({
      success: true,
      content: {
        format: "json",
        catalog_name: "demo-catalog",
        product_count: 1,
      },
    });
    const saved = (result as { content: { path: string } }).content.path;
    const full = path.join(tempRoot, "data", "ecommerce-agent.local", saved);
    expect(fs.existsSync(full)).toBe(true);
    const parsed = JSON.parse(fs.readFileSync(full, "utf8"));
    expect(parsed.products).toHaveLength(1);
  });

  it("saves a CSV catalog", async () => {
    const { saveCatalogTool } = await import("../tools/save-catalog");
    const result = await saveCatalogTool.execute!(
      {
        catalog_name: "csv-demo",
        products: [{ title: "A", price: "1" }],
        format: "csv",
      },
      toolOptions
    );
    expect(result).toMatchObject({
      success: true,
      content: { format: "csv", path: expect.stringMatching(/\.csv$/) },
    });
  });
});

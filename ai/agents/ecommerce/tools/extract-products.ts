import { tool } from "ai";
import {
  getDefaultProductSchema,
  getFirecrawlClient,
  normalizeUrl,
  toFirecrawlJsonSchema,
  type ProductSchema,
} from "./core";
import { extractProductsSchema } from "./schema";

type ScrapeRow = {
  url?: string;
  json?: Record<string, unknown>;
  extract?: Record<string, unknown>;
  markdown?: string;
  metadata?: Record<string, unknown>;
  error?: string;
};

function resolveSchema(
  schema?: Record<string, { type: string; description?: string }>
): ProductSchema {
  if (!schema || Object.keys(schema).length === 0) {
    return getDefaultProductSchema();
  }
  const properties: ProductSchema["properties"] = {};
  for (const [key, value] of Object.entries(schema)) {
    properties[key] = {
      type: value.type,
      description: value.description ?? `${key} field`,
      ...(value.type === "array" ? { items: { type: "string" } } : {}),
    };
  }
  return { type: "object", properties };
}

function rowToProduct(row: ScrapeRow, fallbackUrl?: string) {
  const data = (row.json ?? row.extract ?? {}) as Record<string, unknown>;
  const sourceUrl =
    row.url ??
    (typeof row.metadata?.sourceURL === "string"
      ? row.metadata.sourceURL
      : fallbackUrl);
  return {
    ...data,
    url: (typeof data.url === "string" ? data.url : sourceUrl) ?? sourceUrl,
  };
}

export const extractProductsTool = tool({
  description:
    "Batch-scrape product page URLs with a commerce JSON schema via Firecrawl. Prefer 20–50 URLs per call.",
  inputSchema: extractProductsSchema,
  execute: async ({ urls, schema, max_age_ms }) => {
    const normalized = urls.map(normalizeUrl);
    const productSchema = resolveSchema(schema);
    const jsonSchema = toFirecrawlJsonSchema(productSchema);
    const client = getFirecrawlClient();

    const scrapeOptions = {
      formats: ["markdown", "json"] as ("markdown" | "json")[],
      onlyMainContent: true,
      timeout: 60000,
      maxAge: max_age_ms,
      jsonOptions: {
        schema: jsonSchema as unknown as never,
        prompt:
          "Extract e-commerce product fields from this page. Prefer accurate price, SKU, stock, and variants when present.",
      },
    };

    let products: Array<Record<string, unknown>> = [];
    let credits_used: number | undefined;
    let mode: "batch" | "fallback" = "batch";

    try {
      const batchResult = await client.batchScrapeUrls(
        normalized,
        scrapeOptions
      );

      if ("success" in batchResult && batchResult.success === false) {
        throw new Error(
          "error" in batchResult ? String(batchResult.error) : "Batch scrape failed"
        );
      }

      const data =
        "data" in batchResult && Array.isArray(batchResult.data)
          ? (batchResult.data as ScrapeRow[])
          : [];
      products = data.map((row, i) => rowToProduct(row, normalized[i]));
      credits_used =
        "creditsUsed" in batchResult && typeof batchResult.creditsUsed === "number"
          ? batchResult.creditsUsed
          : data.length;
    } catch {
      mode = "fallback";
      const fallback: Array<Record<string, unknown>> = [];
      for (const url of normalized) {
        try {
          const result = await client.scrapeUrl(url, scrapeOptions);
          if ("success" in result && result.success === false) {
            fallback.push({
              url,
              error: "error" in result ? result.error : "failed",
            });
            continue;
          }
          fallback.push(rowToProduct(result as ScrapeRow, url));
        } catch (err) {
          fallback.push({
            url,
            error: err instanceof Error ? err.message : "Scrape failed",
          });
        }
      }
      products = fallback;
      credits_used = fallback.filter((p) => !("error" in p && p.error)).length;
    }

    const ok = products.filter((p) => !p.error);
    const failed = products.filter((p) => p.error);

    return {
      success: true,
      content: {
        mode,
        requested: normalized.length,
        extracted: ok.length,
        failed: failed.length,
        credits_used,
        schema_fields: Object.keys(productSchema.properties),
        products: ok,
        errors: failed,
      },
    };
  },
});

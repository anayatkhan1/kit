import { z } from "zod";

const schemaFieldSchema = z.object({
  type: z
    .enum(["string", "number", "boolean", "array"])
    .describe("JSON schema type for this field."),
  description: z.string().optional().describe("What this field represents."),
});

const mapStoreSchema = z.object({
  store_url: z
    .string()
    .describe("Store homepage or category URL to map (any public e-commerce site)."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(5000)
    .optional()
    .default(200)
    .describe("Max URLs to discover. Default 200."),
  include_subdomains: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include subdomains when mapping. Default false."),
  save_map: z
    .boolean()
    .optional()
    .default(true)
    .describe("Save the URL map under data/ecommerce-agent.local/maps/."),
});

const inferProductSchemaSchema = z.object({
  product_url: z
    .string()
    .describe("A sample product page URL used to infer the extraction schema."),
  use_default_schema: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "If true, skip inference and return the built-in commerce product schema."
    ),
  save_schema: z
    .boolean()
    .optional()
    .default(true)
    .describe("Save the schema under data/ecommerce-agent.local/schemas/."),
});

const extractProductsSchema = z.object({
  urls: z
    .array(z.string())
    .min(1)
    .max(100)
    .describe(
      "Product page URLs to extract. Prefer batches of 20–50 for credit control."
    ),
  schema: z
    .record(z.string(), schemaFieldSchema)
    .optional()
    .describe(
      "Optional field map (name → type/description). Omit to use the default commerce schema."
    ),
  max_age_ms: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0)
    .describe("Firecrawl cache maxAge in ms. 0 = fresh scrape."),
});

const saveCatalogSchema = z.object({
  catalog_name: z
    .string()
    .describe("Short name for the catalog file (e.g. competitor-q1)."),
  products: z
    .array(z.record(z.string(), z.unknown()))
    .min(1)
    .describe("Array of product objects to persist."),
  format: z
    .enum(["json", "csv"])
    .optional()
    .default("json")
    .describe("Output format. Default json."),
});

export {
  mapStoreSchema,
  inferProductSchemaSchema,
  extractProductsSchema,
  saveCatalogSchema,
};

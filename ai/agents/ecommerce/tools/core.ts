import * as fs from "fs";
import * as path from "path";
import FirecrawlApp from "@mendable/firecrawl-js";

export const ECOMMERCE_AGENT_BASE_DIR = path.join(
  process.cwd(),
  "data",
  "ecommerce-agent.local"
);

/** Default commerce fields for extract_products when no schema is provided. */
export const DEFAULT_PRODUCT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string", description: "Product title or name" },
    sku: { type: "string", description: "Product SKU or ID" },
    description: { type: "string", description: "Product description" },
    price: { type: "string", description: "Current price" },
    currency: { type: "string", description: "Currency code or symbol" },
    compare_at_price: {
      type: "string",
      description: "Original or compare-at price before discount",
    },
    in_stock: { type: "boolean", description: "Whether the product is in stock" },
    availability: { type: "string", description: "Stock / availability text" },
    category: { type: "string", description: "Product category" },
    image_url: { type: "string", description: "Primary product image URL" },
    rating: { type: "number", description: "Average customer rating" },
    review_count: { type: "number", description: "Number of reviews" },
    variants: {
      type: "array",
      description: "Product variants such as size or color",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Variant dimension name" },
          value: { type: "string", description: "Variant value" },
        },
      },
    },
    url: { type: "string", description: "Canonical product URL" },
  },
} as const;

export type ProductSchema = {
  type: "object";
  properties: Record<
    string,
    {
      type: string;
      description?: string;
      items?: unknown;
    }
  >;
};

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function safeFileName(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
}

export function getFirecrawlClient() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "FIRECRAWL_API_KEY is required. Get a key at https://www.firecrawl.dev/app/api-keys"
    );
  }
  return new FirecrawlApp({ apiKey });
}

export function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    throw new Error("URL is required.");
  }
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/** Resolve a user path inside the ecommerce workspace; reject traversal. */
export function resolveWorkspacePath(filePath: string) {
  ensureDir(ECOMMERCE_AGENT_BASE_DIR);
  const base = path.resolve(ECOMMERCE_AGENT_BASE_DIR);
  const fullPath = path.resolve(base, filePath);
  if (!fullPath.startsWith(base + path.sep) && fullPath !== base) {
    throw new Error(
      `Access denied: path "${filePath}" is outside the ecommerce workspace.`
    );
  }
  return fullPath;
}

export function writeWorkspaceFile(
  filePath: string,
  contents: string | Buffer
) {
  const fullPath = resolveWorkspacePath(filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, contents);
  return path.relative(ECOMMERCE_AGENT_BASE_DIR, fullPath);
}

export function saveArtifact(folder: string, fileName: string, payload: unknown) {
  const relative = path.join(folder, fileName);
  const body =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  return writeWorkspaceFile(relative, body);
}

export function buildTaskMetadata(taskName: string) {
  return {
    task_name: safeFileName(taskName),
    created_at: new Date().toISOString(),
  };
}

const PRODUCT_PATH_HINTS =
  /\/(products?|product|p|item|sku|dp|gp\/product)(\/|$)/i;
const CATEGORY_PATH_HINTS =
  /\/(collections?|categor(y|ies)|shop|catalog|search)(\/|$)/i;
const NON_PRODUCT_HINTS =
  /\/(cart|checkout|account|login|signup|blog|news|about|contact|policy|privacy|terms|faq|help)(\/|$)/i;

export type UrlClass = "product" | "category" | "other";

export function classifyStoreUrl(url: string): UrlClass {
  try {
    const pathname = new URL(url).pathname;
    if (NON_PRODUCT_HINTS.test(pathname)) return "other";
    if (PRODUCT_PATH_HINTS.test(pathname)) return "product";
    if (CATEGORY_PATH_HINTS.test(pathname)) return "category";
    return "other";
  } catch {
    return "other";
  }
}

export function classifyUrls(urls: string[]) {
  const product_urls: string[] = [];
  const category_urls: string[] = [];
  const other_urls: string[] = [];

  for (const url of urls) {
    const kind = classifyStoreUrl(url);
    if (kind === "product") product_urls.push(url);
    else if (kind === "category") category_urls.push(url);
    else other_urls.push(url);
  }

  return {
    total: urls.length,
    product_urls,
    category_urls,
    other_urls,
    product_count: product_urls.length,
    category_count: category_urls.length,
    other_count: other_urls.length,
  };
}

/** Infer a commerce-first schema from sample page markdown/html. */
export function inferProductSchemaFromContent(content: string): ProductSchema {
  const schema: ProductSchema = {
    type: "object",
    properties: {},
  };

  const patterns: Array<{
    regex: RegExp;
    field: string;
    type: string;
    description: string;
  }> = [
    {
      regex: /\$[\d,]+\.?\d*/g,
      field: "price",
      type: "string",
      description: "Product price",
    },
    {
      regex: /sku[:\s]*([A-Za-z0-9-_]+)/gi,
      field: "sku",
      type: "string",
      description: "Product SKU",
    },
    {
      regex: /in\s+stock|out\s+of\s+stock|availability/gi,
      field: "availability",
      type: "string",
      description: "Stock availability",
    },
    {
      regex: /rating[:\s]*(\d+\.?\d*)|(\d+\.?\d*)\s*stars?/gi,
      field: "rating",
      type: "number",
      description: "Customer rating",
    },
    {
      regex: /category[:\s]*([^,\n]+)/gi,
      field: "category",
      type: "string",
      description: "Product category",
    },
    {
      regex: /\!\[[^\]]*\]\(([^)]+)\)|<img[^>]*src="/gi,
      field: "image_url",
      type: "string",
      description: "Product image URL",
    },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      schema.properties[pattern.field] = {
        type: pattern.type,
        description: pattern.description,
      };
    }
  }

  const defaults = DEFAULT_PRODUCT_SCHEMA.properties;
  for (const [key, value] of Object.entries(defaults)) {
    if (!schema.properties[key]) {
      schema.properties[key] = {
        type: value.type,
        description: value.description,
        ...("items" in value ? { items: value.items } : {}),
      };
    }
  }

  return schema;
}

export function getDefaultProductSchema(): ProductSchema {
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCT_SCHEMA)) as ProductSchema;
}

/** Convert our schema shape into a JSON Schema object for Firecrawl. */
export function toFirecrawlJsonSchema(schema: ProductSchema) {
  const properties: Record<string, unknown> = {};
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (prop.type === "array") {
      properties[key] = {
        type: "array",
        description: prop.description ?? `${key} field`,
        items: prop.items ?? { type: "string" },
      };
    } else {
      properties[key] = {
        type: prop.type,
        description: prop.description ?? `${key} field`,
      };
    }
  }
  return {
    type: "object",
    properties,
    required: Object.keys(schema.properties),
  };
}

export function productsToCsv(products: Array<Record<string, unknown>>) {
  if (products.length === 0) {
    return "url\n";
  }
  const keys = Array.from(
    products.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  const escape = (value: unknown) => {
    const text =
      value === null || value === undefined
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };
  const lines = [keys.join(",")];
  for (const row of products) {
    lines.push(keys.map((k) => escape(row[k])).join(","));
  }
  return lines.join("\n") + "\n";
}

export function extractMapLinks(mapResult: unknown): string[] {
  if (!mapResult || typeof mapResult !== "object") return [];
  const result = mapResult as {
    success?: boolean;
    links?: string[];
    data?: string[];
    urls?: string[];
  };
  if (Array.isArray(result.links)) return result.links;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.urls)) return result.urls;
  return [];
}

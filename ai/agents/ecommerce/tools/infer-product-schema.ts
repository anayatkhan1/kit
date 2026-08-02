import { tool } from "ai";
import {
  getDefaultProductSchema,
  getFirecrawlClient,
  inferProductSchemaFromContent,
  normalizeUrl,
  saveArtifact,
} from "./core";
import { inferProductSchemaSchema } from "./schema";

export const inferProductSchemaTool = tool({
  description:
    "Infer a commerce product schema from a sample product URL (or return the built-in default). Saves under data/ecommerce-agent.local/schemas/ by default.",
  inputSchema: inferProductSchemaSchema,
  execute: async ({ product_url, use_default_schema, save_schema }) => {
    const url = normalizeUrl(product_url);
    let schema = getDefaultProductSchema();
    let source: "default" | "inferred" = "default";
    let sample_preview: string | undefined;

    if (!use_default_schema) {
      const client = getFirecrawlClient();
      const scrapeResult = await client.scrapeUrl(url, {
        formats: ["markdown", "html"],
        onlyMainContent: true,
        timeout: 30000,
        maxAge: 86400000,
      });

      if ("success" in scrapeResult && scrapeResult.success === false) {
        source = "default";
      } else if ("markdown" in scrapeResult || "html" in scrapeResult) {
        const markdown =
          "markdown" in scrapeResult ? scrapeResult.markdown ?? "" : "";
        const html = "html" in scrapeResult ? scrapeResult.html ?? "" : "";
        const content = `${markdown}\n${html}`;
        schema = inferProductSchemaFromContent(content);
        source = "inferred";
        sample_preview = markdown.slice(0, 500);
      }
    }

    let saved_path: string | undefined;
    if (save_schema) {
      const host = (() => {
        try {
          return new URL(url).hostname.replace(/\./g, "-");
        } catch {
          return "store";
        }
      })();
      saved_path = saveArtifact("schemas", `${host}-product.json`, {
        product_url: url,
        source,
        inferred_at: new Date().toISOString(),
        schema,
      });
    }

    return {
      success: true,
      content: {
        product_url: url,
        source,
        schema,
        fields: Object.keys(schema.properties),
        sample_preview,
        saved_path,
      },
    };
  },
});

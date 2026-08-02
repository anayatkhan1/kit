import { tool } from "ai";
import {
  classifyUrls,
  extractMapLinks,
  getFirecrawlClient,
  normalizeUrl,
  saveArtifact,
} from "./core";
import { mapStoreSchema } from "./schema";

export const mapStoreTool = tool({
  description:
    "Map an e-commerce store via Firecrawl sitemap-style discovery. Best for Shopify and open catalogs. For Amazon category/search pages (/b/, /s?), use discover_products instead — map usually returns almost no product URLs.",
  inputSchema: mapStoreSchema,
  execute: async ({
    store_url,
    limit,
    include_subdomains,
    save_map,
  }) => {
    const url = normalizeUrl(store_url);
    const client = getFirecrawlClient();

    const mapResult = await client.mapUrl(url, {
      limit,
      includeSubdomains: include_subdomains,
    });

    if ("success" in mapResult && mapResult.success === false) {
      throw new Error(
        `map_store failed: ${"error" in mapResult ? mapResult.error : "unknown error"}`
      );
    }

    const urls = extractMapLinks(mapResult);
    const analysis = classifyUrls(urls);

    let saved_path: string | undefined;
    if (save_map) {
      const host = (() => {
        try {
          return new URL(url).hostname.replace(/\./g, "-");
        } catch {
          return "store";
        }
      })();
      saved_path = saveArtifact("maps", `${host}-urls.json`, {
        store_url: url,
        mapped_at: new Date().toISOString(),
        ...analysis,
        urls,
      });
    }

    return {
      success: true,
      content: {
        store_url: url,
        ...analysis,
        saved_path,
        sample_product_urls: analysis.product_urls.slice(0, 10),
        sample_category_urls: analysis.category_urls.slice(0, 10),
      },
    };
  },
});

import { tool } from "ai";
import {
  classifyStoreUrl,
  extractProductLinksFromPage,
  getFirecrawlClient,
  normalizeUrl,
  saveArtifact,
} from "./core";
import { discoverProductsSchema } from "./schema";

export const discoverProductsTool = tool({
  description:
    "Scrape a category/search/listing page and extract product URLs from on-page links. Use this instead of map_store for Amazon, Flipkart, and other JS-heavy marketplaces where map returns almost no product URLs.",
  inputSchema: discoverProductsSchema,
  execute: async ({ listing_url, limit, save_map }) => {
    const url = normalizeUrl(listing_url);
    const client = getFirecrawlClient();

    const scrapeResult = await client.scrapeUrl(url, {
      formats: ["links", "markdown"],
      onlyMainContent: false,
      timeout: 60000,
      waitFor: 3000,
    });

    if ("success" in scrapeResult && scrapeResult.success === false) {
      throw new Error(
        `discover_products failed: ${
          "error" in scrapeResult ? scrapeResult.error : "unknown error"
        }`
      );
    }

    const links =
      "links" in scrapeResult && Array.isArray(scrapeResult.links)
        ? scrapeResult.links
        : [];

    // Also harvest markdown hrefs as a fallback
    const markdown =
      "markdown" in scrapeResult && typeof scrapeResult.markdown === "string"
        ? scrapeResult.markdown
        : "";
    const mdHrefs = Array.from(
      markdown.matchAll(/\[[^\]]*\]\((https?:[^)\s]+)\)/g)
    ).map((m) => m[1]);

    const product_urls = extractProductLinksFromPage([...links, ...mdHrefs], {
      limit,
      sameHostAs: url,
    });

    const listing_class = classifyStoreUrl(url);

    let saved_path: string | undefined;
    if (save_map) {
      const host = (() => {
        try {
          return new URL(url).hostname.replace(/\./g, "-");
        } catch {
          return "store";
        }
      })();
      saved_path = saveArtifact("maps", `${host}-listing-products.json`, {
        listing_url: url,
        listing_class,
        discovered_at: new Date().toISOString(),
        product_count: product_urls.length,
        product_urls,
        raw_link_count: links.length + mdHrefs.length,
      });
    }

    return {
      success: true,
      content: {
        listing_url: url,
        listing_class,
        product_count: product_urls.length,
        product_urls,
        sample_product_urls: product_urls.slice(0, 10),
        raw_link_count: links.length + mdHrefs.length,
        saved_path,
        hint:
          product_urls.length === 0
            ? "No product URLs found on this page. Amazon/Flipkart often block scrapers — try a public Shopify collection URL, or pass product /dp/ links directly to extract_products."
            : "Pass these URLs to extract_products next.",
      },
    };
  },
});

# ecommerce-agent — SPEC

> Status: implemented
> Approved by: @user | date: 2026-07-28

## Job

Turn any public e-commerce website into structured product, pricing, and inventory
data saved to a local workspace — for catalog extraction, price monitoring, and
competitive research across Shopify, WooCommerce, Magento, and custom stores.

## Lane

Web

## Context (from user)

- **Prototype / reference:** `tmp/firecrawl-migrator` (`/api/map`, `/api/crawl`)
- **Docs reference:** [Firecrawl Product & E-commerce](https://docs.firecrawl.dev/use-cases/product-ecommerce)
- **Primary provider:** Firecrawl (`@mendable/firecrawl-js`)
- **Secondary providers:** Anthropic (LLM — repo default)
- **Must-haves:**
  - Works on **any** public e-commerce site (not per-retailer tools)
  - Map store URLs → discover product/listing pages
  - Extract structured product data (title, SKU, price, variants, stock, images, reviews)
  - Save catalogs to local workspace
  - Commerce-focused prompts and default product schema
- **Out of scope (v1):**
  - Per-platform tools (`scrape_amazon`, `scrape_flipkart`, etc.)
  - Full migrator wizard UI from `tmp/firecrawl-migrator`
  - Scheduled price alerts / cron monitoring
  - CMS export (Shopify CSV, Woo import)
  - Authenticated / user-specific pricing flows
  - Login-gated marketplaces (Amazon anti-bot, etc.) — document as limitation

## Providers & credentials

| Provider | Purpose | Env var | Notes |
|----------|---------|---------|-------|
| Anthropic | LLM orchestration | `ANTHROPIC_API_KEY` | `claude-sonnet-4-5-20250929` in `agent.ts` |
| Firecrawl | Map, scrape, batch extract | `FIRECRAWL_API_KEY` | Usage-based credits; map ≈ 2 credits |

## v1 tools (4)

| Tool | Purpose | Firecrawl API | Writes to workspace |
|------|---------|---------------|---------------------|
| `map_store` | Discover URLs on a store; classify product vs category/listing pages | `mapUrl` | `maps/<store>-urls.json` |
| `infer_product_schema` | Scrape one sample product URL; return commerce field schema | `scrapeUrl` + ecommerce heuristics | `schemas/<store>-product.json` (optional) |
| `extract_products` | Batch-scrape product URLs with JSON schema | `batchScrapeUrls` (fallback: per-URL `scrapeUrl`) | returns data; agent calls `save_catalog` |
| `save_catalog` | Persist catalog JSON/CSV + metadata | — | `catalogs/<name>.json` |

### Default product schema (built into `tools/core.ts`)

```json
{
  "title": "string",
  "sku": "string",
  "description": "string",
  "price": "string",
  "currency": "string",
  "compare_at_price": "string",
  "in_stock": "boolean",
  "availability": "string",
  "category": "string",
  "image_url": "string",
  "rating": "number",
  "review_count": "number",
  "variants": [{ "name": "string", "value": "string" }],
  "url": "string"
}
```

### Tool inputs (summary)

- `map_store`: `store_url`, `limit?` (default 200), `include_subdomains?` (default false)
- `infer_product_schema`: `product_url`, `use_default_schema?` (fallback to built-in commerce schema)
- `extract_products`: `urls[]`, `schema?` (object or omit to use default), `max_age_ms?` (cache)
- `save_catalog`: `catalog_name`, `products` (array), `format?` (`json` | `csv`)

### Prototype mapping

| Migrator route | Agent tool |
|----------------|------------|
| `POST /api/map` → `mapUrl` | `map_store` (+ e-commerce URL classification, not blog-focused) |
| `GET /api/crawl` → sample scrape + infer | `infer_product_schema` (+ commerce-first `getDefaultProductSchema`) |
| `POST /api/crawl` → `batchScrapeUrls` | `extract_products` |
| _(new)_ | `save_catalog` (workspace pattern from `extraction-agent`) |

## Workspace layout

```
data/ecommerce-agent.local/
├── maps/           # discovered URL lists
├── schemas/        # inferred or saved product schemas
└── catalogs/       # extracted product JSON/CSV
```

## Deferred (extension docs only)

- Price snapshot diff / “monitoring” recipe (user adds cron or scheduled job)
- Export to Shopify/WooCommerce CSV (`tools/shopify-export.ts` example)
- `filter_product_urls` helper for large maps
- Auth headers for member-only stores
- Review pagination / infinite-scroll listing recipes in docs

## Overlap check

| Existing agent | Overlap? | Decision |
|----------------|----------|----------|
| web-agent | Both touch the web | **Distinct** — web-agent researches/answers; ecommerce-agent bulk-extracts product catalogs with Firecrawl schemas |
| extraction-agent | Both extract structured data | **Distinct** — extraction-agent is local files (PDF/sheet/image); ecommerce-agent is live store URLs |

## Example user prompts

1. "Map all product URLs on `https://example-shop.com` and save the list."
2. "Infer a product schema from this sample URL, then extract title, price, SKU, stock, and variants from these 20 product links."
3. "Scrape this competitor's category page products and save a catalog JSON for price comparison."
4. "Extract pricing and availability from these Shopify product URLs and save as `competitor-q1`."

## Docs demo scenarios (simulated)

1. **Catalog extraction** — map store → extract 3 products → save catalog
2. **Price monitoring** — extract price fields from product URLs → save snapshot (doc recipe for repeat runs)

## Acceptance criteria

- [x] User can `npx agentcn add ecommerce-agent` and install all required files
- [x] `map_store` returns URLs with basic product/category classification
- [x] `extract_products` returns structured JSON using commerce schema
- [x] Outputs land under `data/ecommerce-agent.local/`
- [x] Clear error when `FIRECRAWL_API_KEY` is missing
- [x] Docs page + simulated demo with ≥2 scenarios
- [x] Tests pass: `pnpm jest ai/agents/ecommerce` (unit + gated live)
- [x] `pnpm agentcn:registry:build` + `pnpm exec nx run @kit/web:build` pass

## Gate checklist

- [x] Distinct job (e-commerce catalog extraction, not generic web research)
- [x] Real user prompts (see above)
- [x] 15-minute install path (`agentcn add` + `FIRECRAWL_API_KEY`)
- [x] Minimal API surface (Firecrawl + Anthropic only)
- [x] Extension story documented in MDX
- [x] Lane fit (Web — product data from stores)

## Implementation plan

| # | Todo | Commit message | Verify before commit |
|---|------|----------------|----------------------|
| 0 | This SPEC (after approval) | `docs(agent): add ecommerce-agent spec` | User approved |
| 1 | Source: `ai/agents/ecommerce/` — agent, prompt, tools, core, default schema, workspace helpers | `feat(agent): add ecommerce-agent source for store catalog extraction` | typecheck / import smoke |
| 2 | Tests: `test/test-helpers.ts`, unit tests per tool, gated live tests | `test(agent): add ecommerce-agent tests` | `pnpm jest ai/agents/ecommerce` |
| 3 | Registry: `registry/registry-agents.ts` + `@mendable/firecrawl-js` dep | `feat(registry): register ecommerce-agent` | `pnpm agentcn:registry:build` |
| 4 | Docs MDX + demo + `meta.json` + tool labels | `docs(agent): add ecommerce-agent docs and demo` | web build + demo preview |
| 5 | Verify full pipeline | `chore(agent): verify ecommerce-agent build` | `pnpm deploy:build` |
| 6 | (Optional) `examples/agent-ui-template/` embed | `feat(examples): wire ecommerce-agent in agent-ui-template` | manual chat smoke |

## Registry sketch

- **name:** `ecommerce-agent`
- **title:** E-commerce Agent
- **categories:** `["web", "ecommerce", "scraping"]`
- **dependencies:** `ai`, `@ai-sdk/anthropic`, `zod`, `@mendable/firecrawl-js`
- **envVars:** `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`
- **meta.providers:** `["anthropic", "firecrawl"]`

## Notes

- Rebuild migrator logic in AgentCN layout; do not copy Next.js route handlers verbatim.
- E-commerce URL heuristics in `map_store` should prefer `/products/`, `/product/`, `/p/`, `/item/`, etc. over blog paths from the migrator prototype.
- `infer_product_schema` uses commerce-first defaults; blog/contact inference from migrator is trimmed for v1.
- Large catalogs: prompt should recommend batching URLs (e.g. 20–50 per `extract_products` call) to manage Firecrawl credits.
- Production ship: deploy web app after merge so `npx agentcn add ecommerce-agent` resolves on agentcn.dev.

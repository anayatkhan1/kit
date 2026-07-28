import { ToolSet } from "ai";
import { mapStoreTool } from "./map-store";
import { inferProductSchemaTool } from "./infer-product-schema";
import { extractProductsTool } from "./extract-products";
import { saveCatalogTool } from "./save-catalog";

export const ecommerceToolset = {
  map_store: mapStoreTool,
  infer_product_schema: inferProductSchemaTool,
  extract_products: extractProductsTool,
  save_catalog: saveCatalogTool,
} as ToolSet;

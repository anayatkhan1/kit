import { tool } from "ai";
import {
  buildTaskMetadata,
  productsToCsv,
  writeWorkspaceFile,
} from "./core";
import { saveCatalogSchema } from "./schema";

export const saveCatalogTool = tool({
  description:
    "Save extracted product catalog as JSON or CSV under data/ecommerce-agent.local/catalogs/.",
  inputSchema: saveCatalogSchema,
  execute: async ({ catalog_name, products, format }) => {
    const meta = buildTaskMetadata(catalog_name);
    const extension = format === "csv" ? "csv" : "json";
    const relativePath = `catalogs/${meta.task_name}.${extension}`;

    const body =
      format === "csv"
        ? productsToCsv(products as Array<Record<string, unknown>>)
        : JSON.stringify(
            {
              catalog_name: meta.task_name,
              created_at: meta.created_at,
              product_count: products.length,
              products,
            },
            null,
            2
          );

    const savedPath = writeWorkspaceFile(relativePath, body);

    return {
      success: true,
      content: {
        path: savedPath,
        format,
        catalog_name: meta.task_name,
        product_count: products.length,
        created_at: meta.created_at,
      },
    };
  },
});

import { z } from "zod";

export const registryFileSchema = z.object({
  path: z.string().min(1),
  type: z.string().min(1),
  target: z.string().min(1).optional(),
  content: z.string(),
});

export const registryItemSchema = z.object({
  schemaVersion: z.number().int(),
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  title: z.string().optional(),
  categories: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  envVars: z.record(z.string()).optional(),
  files: z.array(registryFileSchema),
});

export const registryIndexItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categories: z.array(z.string()).optional(),
});

export const registryIndexSchema = z.object({
  schemaVersion: z.number().int(),
  name: z.string().min(1),
  homepage: z.string().optional(),
  items: z.array(registryIndexItemSchema),
});

export const addOptionsSchema = z.object({
  registry: z.string().optional(),
  dryRun: z.boolean().default(false),
  overwrite: z.boolean().default(false),
  yes: z.boolean().default(false),
  verbose: z.boolean().default(false),
  cwd: z.string().optional(),
});

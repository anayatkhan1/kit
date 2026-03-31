import { z } from "zod";

const writeFileSchema = z.object({
  path: z.string().describe("The path to the file to create"),
  content: z.string().describe("The content of the file to create"),
});

const readFileSchema = z.object({
  path: z.string().describe("The path to the file to read"),
});

const deleteFileSchema = z.object({
  path: z.string().describe("The path to the file or directory to delete"),
});

const listDirectorySchema = z.object({
  path: z.string().describe("The path to the directory to list"),
});

const createDirectorySchema = z.object({
  path: z.string().describe("The path to the directory to create"),
});

const existsSchema = z.object({
  path: z.string().describe("The path to the file or directory to check"),
});

const searchFilesSchema = z.object({
  pattern: z.string().describe("The pattern to search for"),
});

export {
  writeFileSchema,
  readFileSchema,
  deleteFileSchema,
  listDirectorySchema,
  createDirectorySchema,
  existsSchema,
  searchFilesSchema,
};

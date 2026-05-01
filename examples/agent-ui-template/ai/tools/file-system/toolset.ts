import { ToolSet, tool } from "ai";
import * as fs from "./core";
import {
	createDirectorySchema,
	deleteFileSchema,
	existsSchema,
	listDirectorySchema,
	readFileSchema,
	searchFilesSchema,
	writeFileSchema,
} from "./schema";

export const fileSystemToolset = {
	writeFile: tool({
		description: "Write content to a file",
		inputSchema: writeFileSchema,
		execute: ({ path, content }) => fs.writeFile(path, content),
	}),

	readFile: tool({
		description: "Read content from a file",
		inputSchema: readFileSchema,
		execute: ({ path }) => fs.readFile(path),
	}),

	deletePath: tool({
		description: "Delete a file or directory",
		inputSchema: deleteFileSchema,
		execute: ({ path }) => fs.deletePath(path),
	}),

	listDirectory: tool({
		description: "List directory contents",
		inputSchema: listDirectorySchema,
		execute: ({ path }) => fs.listDirectory(path),
	}),

	createDirectory: tool({
		description: "Create a directory",
		inputSchema: createDirectorySchema,
		execute: ({ path }) => fs.createDirectory(path),
	}),

	exists: tool({
		description: "Check if path exists",
		inputSchema: existsSchema,
		execute: ({ path }) => fs.exists(path),
	}),

	searchFiles: tool({
		description: "Search files by pattern",
		inputSchema: searchFilesSchema,
		execute: ({ pattern }) => fs.searchFiles(pattern),
	}),
} as ToolSet;

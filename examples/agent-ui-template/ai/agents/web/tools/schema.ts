import { z } from "zod";

const webSearchSchema = z.object({
	query: z.string().describe("The search query."),
	allow_cached_results: z
		.boolean()
		.optional()
		.default(true)
		.describe("Allow cached search results when available."),
	num_results: z
		.number()
		.int()
		.min(1)
		.max(25)
		.optional()
		.default(5)
		.describe("Maximum number of search results."),
});

const answerQuestionSchema = z.object({
	question: z.string().describe("The question to answer."),
	output_schema: z
		.string()
		.optional()
		.describe("Optional JSONSchema v7 string for structured output."),
});

const deepResearchSchema = z.object({
	task_name: z
		.string()
		.describe("Short task name used for metadata and storage."),
	instructions: z.string().describe("Detailed research instructions."),
	tier: z
		.enum(["standard", "pro"])
		.optional()
		.default("standard")
		.describe("Research quality tier."),
	output_schema: z
		.string()
		.optional()
		.describe("Optional JSONSchema v7 string for structured output."),
});

const useBrowserSchema = z.object({
	task: z
		.string()
		.describe("Browser task to execute. Be explicit about the goal."),
	initialUrl: z
		.string()
		.optional()
		.default("https://google.com")
		.describe("Initial URL for the browser session."),
});

const createWebsetSchema = z.object({
	task_name: z
		.string()
		.describe("Short task name used for metadata and storage."),
	instructions: z
		.string()
		.describe("Instructions describing entity search criteria."),
	num_results: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.default(10)
		.describe("Maximum number of matched entities."),
	entity_type: z
		.enum(["company", "person", "article", "research_paper", "custom"])
		.optional()
		.describe("Entity type for webset matching."),
	custom_entity_description: z
		.string()
		.optional()
		.describe("Required when entity_type is custom."),
	enrichments: z.array(
		z.object({
			description: z.string().describe("Enrichment description."),
			format: z
				.enum(["text", "number", "date", "options", "email", "phone"])
				.describe("Output format for the enrichment field."),
		}),
	),
});

export {
	webSearchSchema,
	answerQuestionSchema,
	deepResearchSchema,
	useBrowserSchema,
	createWebsetSchema,
};

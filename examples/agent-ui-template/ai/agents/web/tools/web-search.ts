import { tool } from "ai";
import { getExaClient } from "./core";
import { webSearchSchema } from "./schema";

export const webSearchTool = tool({
	description: "Search the web for up-to-date information.",
	inputSchema: webSearchSchema,
	execute: async ({ query, allow_cached_results, num_results }) => {
		const exa = getExaClient();
		const { results } = await exa.searchAndContents(query, {
			livecrawl: allow_cached_results ? "fallback" : "preferred",
			numResults: num_results,
			highlights: true,
		});

		return {
			success: true,
			content: results.map((result) => ({
				title: result.title,
				url: result.url,
				content: result.highlights.join("\n"),
				publishedDate: result.publishedDate,
			})),
		};
	},
});

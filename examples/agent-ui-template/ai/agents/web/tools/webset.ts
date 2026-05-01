import { tool } from "ai";
import { buildTaskMetadata, getExaClient, saveArtifact } from "./core";
import { createWebsetSchema } from "./schema";

export const websetTool = tool({
	description:
		"Create a webset (entity list + enrichments) from user instructions.",
	inputSchema: createWebsetSchema,
	execute: async ({
		task_name,
		instructions,
		num_results,
		entity_type,
		custom_entity_description,
		enrichments,
	}) => {
		const exa = getExaClient();

		const webset = await exa.websets.create({
			search: {
				query: instructions,
				count: num_results,
				entity: entity_type
					? entity_type === "custom"
						? custom_entity_description
							? { type: "custom", description: custom_entity_description }
							: undefined
						: { type: entity_type }
					: undefined,
			},
			enrichments: enrichments.map((item) => ({
				description: item.description,
			})),
		});

		const relativePath = saveArtifact("websets", `${webset.id}.json`, {
			type: "webset",
			id: webset.id,
			provider: "exa",
			name: task_name,
			data: webset,
			metadata: buildTaskMetadata(task_name),
		});

		return {
			success: true,
			message: "Webset created.",
			artifact_path: relativePath,
			webset_id: webset.id,
		};
	},
});

import { tool } from "ai";
import { buildTaskMetadata, getExaClient, saveArtifact } from "./core";
import { deepResearchSchema } from "./schema";

export const deepResearchTool = tool({
	description: "Create a deep research task.",
	inputSchema: deepResearchSchema,
	execute: async ({ task_name, instructions, tier, output_schema }) => {
		const exa = getExaClient();

		const researchTask = await exa.research.create({
			instructions,
			model: tier === "pro" ? "exa-research-pro" : "exa-research",
			outputSchema: {
				schema: output_schema ? JSON.parse(output_schema) : undefined,
				inferSchema: !Boolean(output_schema),
			},
		});

		const relativePath = saveArtifact(
			"research-tasks",
			`${researchTask.researchId}.json`,
			{
				type: "research-task",
				id: researchTask.researchId,
				provider: "exa",
				name: task_name,
				data: researchTask,
				metadata: buildTaskMetadata(task_name),
			},
		);

		return {
			success: true,
			message: "Research task created.",
			artifact_path: relativePath,
			task_id: researchTask.researchId,
		};
	},
});

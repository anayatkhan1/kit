type ToolLikePart = {
	type: string;
	input?: unknown;
};

function asRecord(input: unknown): Record<string, unknown> | undefined {
	if (!input || typeof input !== "object") return undefined;
	return input as Record<string, unknown>;
}

const pathToolInput = (part: ToolLikePart) => {
	const path = asRecord(part.input)?.path;
	if (typeof path === "string" && path.length > 0) return path;
	return "unknown";
};

const patternToolInput = (part: ToolLikePart) => {
	const pattern = asRecord(part.input)?.pattern;
	if (typeof pattern === "string" && pattern.length > 0) return pattern;
	return "unknown";
};

const queryToolInput = (part: ToolLikePart) => {
	const query = asRecord(part.input)?.query;
	if (typeof query === "string" && query.length > 0) return query;
	return "unknown";
};

const questionToolInput = (part: ToolLikePart) => {
	const question = asRecord(part.input)?.question;
	if (typeof question === "string" && question.length > 0) return question;
	return "unknown";
};

const taskToolInput = (part: ToolLikePart) => {
	const input = asRecord(part.input);
	const task = input?.task_name ?? input?.task;
	if (typeof task === "string" && task.length > 0) return task;
	return "unknown";
};

const toolLabelFormatters: Record<string, (part: ToolLikePart) => string> = {
	"tool-writeFile": (part) => `Write: ${pathToolInput(part)}`,
	"tool-readFile": (part) => `Read: ${pathToolInput(part)}`,
	"tool-deletePath": (part) => `Delete: ${pathToolInput(part)}`,
	"tool-listDirectory": (part) => `List: ${pathToolInput(part)}`,
	"tool-createDirectory": (part) => `Create dir: ${pathToolInput(part)}`,
	"tool-exists": (part) => `Exists: ${pathToolInput(part)}`,
	"tool-searchFiles": (part) => `Search: ${patternToolInput(part)}`,
	"tool-web_search": (part) => `Web search: ${queryToolInput(part)}`,
	"tool-answer_question": (part) =>
		`Answer question: ${questionToolInput(part)}`,
	"tool-deep_research": (part) => `Deep research: ${taskToolInput(part)}`,
	"tool-use_browser": (part) => `Use browser: ${taskToolInput(part)}`,
	"tool-create_webset": (part) => `Create webset: ${taskToolInput(part)}`,
};

export function getToolLabel(part: ToolLikePart): string {
	const formatter = toolLabelFormatters[part.type];
	if (formatter) return formatter(part);

	return `Tool: ${part.type.replace(/^tool-/, "")}`;
}

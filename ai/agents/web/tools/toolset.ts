import { ToolSet } from "ai";
import { webSearchTool } from "./web-search";
import { answerQuestionTool } from "./answer-question";
import { deepResearchTool } from "./deep-research";
import { useBrowserTool } from "./use-browser";
import { websetTool } from "./webset";

export const webToolset = {
  web_search: webSearchTool,
  answer_question: answerQuestionTool,
  deep_research: deepResearchTool,
  use_browser: useBrowserTool,
  create_webset: websetTool,
} as ToolSet;

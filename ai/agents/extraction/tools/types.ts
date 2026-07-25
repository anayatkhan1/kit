import { InferUITools, UIMessage } from "ai";
import { extractionToolset } from "./toolset";

type ExtractionTools = InferUITools<typeof extractionToolset>;

export type ExtractionUIMessage = UIMessage<never, never, ExtractionTools>;

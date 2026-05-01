import { InferUITools, UIMessage } from "ai";
import { webToolset } from "./toolset";

type WebTools = InferUITools<typeof webToolset>;

export type WebUIMessage = UIMessage<never, never, WebTools>;

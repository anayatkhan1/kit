import { InferUITools, UIMessage } from "ai";
import { fileSystemToolset } from "./toolset";

type MyTools = InferUITools<typeof fileSystemToolset>;

export type MyUIMessage = UIMessage<never, never, MyTools>;

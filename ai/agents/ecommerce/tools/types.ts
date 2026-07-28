import { InferUITools, UIMessage } from "ai";
import { ecommerceToolset } from "./toolset";

type EcommerceTools = InferUITools<typeof ecommerceToolset>;

export type EcommerceUIMessage = UIMessage<never, never, EcommerceTools>;

import { describe } from "@jest/globals";
declare const process: { env: Record<string, string | undefined> };
/** Conditional suites when provider API keys are present (loaded via kit/jest.setup.ts). */
export const describeIfExa =
  process.env.EXA_API_KEY ? describe : describe.skip;

export const describeIfAnchor =
  process.env.ANCHOR_API_KEY ? describe : describe.skip;

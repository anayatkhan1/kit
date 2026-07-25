import { describe } from "@jest/globals";
declare const process: { env: Record<string, string | undefined> };

/** Conditional suites when Anthropic API key is present. */
export const describeIfAnthropic = process.env.ANTHROPIC_API_KEY
  ? describe
  : describe.skip;

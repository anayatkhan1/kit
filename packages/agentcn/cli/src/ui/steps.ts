import * as clack from "@clack/prompts";
import { type ConfirmFn } from "../utils/prompt.js";

export async function runStep<T>(
  label: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const spin = clack.spinner();
  spin.start(label);
  try {
    const result = await fn();
    spin.stop(label);
    return result;
  } catch (error) {
    spin.stop(`Failed: ${label}`);
    throw error;
  }
}

export async function confirmProceed(
  message: string,
  defaultValue = true,
  confirm?: ConfirmFn
): Promise<boolean> {
  const { confirmAction } = await import("../utils/prompt.js");
  const ask = confirm ?? confirmAction;
  return ask(message, defaultValue);
}

export { handleCancel } from "../utils/prompt.js";

import * as clack from "@clack/prompts";
import { type ConfirmFn } from "../utils/prompt.js";

export async function runStep<T>(
  label: string,
  fn: () => Promise<T> | T,
  options?: { successLabel?: string }
): Promise<T> {
  const spin = clack.spinner();
  spin.start(label);
  try {
    // Yield so the spinner can render before long-running work starts.
    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });
    const result = await fn();
    spin.stop(options?.successLabel ?? label, 0);
    return result;
  } catch (error) {
    spin.stop(`Failed: ${label}`, 1);
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

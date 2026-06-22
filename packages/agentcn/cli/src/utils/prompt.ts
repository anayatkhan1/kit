import * as clack from "@clack/prompts";

export type ConfirmFn = (
  message: string,
  defaultValue?: boolean
) => Promise<boolean>;

export async function confirmAction(
  message: string,
  defaultValue = true
): Promise<boolean> {
  const result = await clack.confirm({
    message,
    initialValue: defaultValue,
  });

  if (clack.isCancel(result)) {
    clack.cancel("Installation cancelled.");
    process.exit(0);
  }

  return result;
}

export function handleCancel(): never {
  clack.cancel("Installation cancelled.");
  process.exit(0);
}

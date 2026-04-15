import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export async function confirmAction(
  message: string,
  defaultValue = true
): Promise<boolean> {
  const suffix = defaultValue ? "Y/n" : "y/N";
  const rl = createInterface({ input, output });
  try {
    const answer = (await rl.question(`${message} (${suffix}) `))
      .trim()
      .toLowerCase();
    if (!answer) return defaultValue;
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

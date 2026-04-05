import ora, { type Options } from "ora";

export function spinner(text: Options["text"]) {
  return ora({ text });
}

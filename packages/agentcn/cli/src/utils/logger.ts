import pc from "picocolors";

export const logger = {
  error(...args: unknown[]) {
    console.error(pc.red(args.join(" ")));
  },
  warn(...args: unknown[]) {
    console.warn(pc.yellow(args.join(" ")));
  },
  info(...args: unknown[]) {
    console.log(args.join(" "));
  },
  success(...args: unknown[]) {
    console.log(pc.green(args.join(" ")));
  },
  dim(...args: unknown[]) {
    console.log(pc.dim(args.join(" ")));
  },
  break() {
    console.log("");
  },
};

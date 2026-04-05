export const logger = {
  error(...args: unknown[]) {
    console.error(args.join(" "));
  },
  warn(...args: unknown[]) {
    console.warn(args.join(" "));
  },
  info(...args: unknown[]) {
    console.log(args.join(" "));
  },
  success(...args: unknown[]) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
};

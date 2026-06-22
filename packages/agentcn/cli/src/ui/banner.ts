import * as clack from "@clack/prompts";
import pc from "picocolors";

const ASCII_BANNER = `
 █████╗  ██████╗ ███████╗███╗   ██╗████████╗ ██████╗███╗   ██╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝████╗  ██║
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ██║     ██╔██╗ ██║
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ██║     ██║╚██╗██║
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ╚██████╗██║ ╚████║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝╚═╝  ╚═══╝
`.trim();

export function printBanner(): void {
  console.log(pc.cyan(ASCII_BANNER));
  console.log("");
}

export function showIntro(agentLabel: string): void {
  clack.intro(pc.bgCyan(pc.black(` Installing ${agentLabel} `)));
}

export function showOutro(message: string): void {
  clack.outro(pc.green(message));
}

export function showNote(message: string): void {
  clack.note(message);
}

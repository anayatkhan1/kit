#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { infoCommand } from "./commands/info.js";
import { listCommand } from "./commands/list.js";

declare const __dirname: string;

const { version } = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf-8")
) as { version: string };

const program = new Command();

program
  .name("agentcn")
  .description("Install reusable AI agents into your project")
  .version(version);

program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(infoCommand);

program.parse();

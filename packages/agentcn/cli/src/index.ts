#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./commands/add.js";
import { infoCommand } from "./commands/info.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("agentcn")
  .description("Install reusable AI agents into your project")
  .version("0.1.0");

program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(infoCommand);

program.parse();

#!/usr/bin/env node

import { Command } from "commander";
import { addCommand } from "./add.js";

const program = new Command();

program
  .name("agentcn")
  .description("Install AI agents into your project (shadcn-style for agents)")
  .version("0.1.0");

program.addCommand(addCommand);

program.parse();

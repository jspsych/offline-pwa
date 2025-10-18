#!/usr/bin/env node

import { Command } from "commander";
import { create } from "../dist/create.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8"));

const program = new Command();

program
  .name("create-offline-pwa")
  .description("Create offline-capable jsPsych experiments for tablets in the current directory")
  .version(pkg.version)
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-t, --template <type>", "Template to use: cdn or build", "cdn")
  .action(create);

program.parse();

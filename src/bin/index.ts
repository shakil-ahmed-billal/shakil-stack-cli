#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { initProject } from "../commands/init.js";
import { generateModule } from "../commands/module.js";
import { buildBackend } from "../commands/build.js";
import { handlePrisma } from "../commands/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get version
// We look for package.json in the project root
const packageJsonPath = path.resolve(__dirname, fs.existsSync(path.resolve(__dirname, "../../package.json")) ? "../../package.json" : "../package.json");
const packageJson = fs.readJsonSync(packageJsonPath);

const program = new Command();

program
  .name("shakil-stack")
  .description("Full-stack EchoNet-style project generator CLI")
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize a new full-stack project")
  .argument("[projectName]", "Name of the project")
  .action((projectName) => {
    initProject(projectName);
  });

program
  .command("generate")
  .alias("g")
  .description("Generate a new module")
  .argument("<type>", "Type of generation (module)")
  .argument("<name>", "Name of the module")
  .action((type, name) => {
    if (type === "module") {
      generateModule(name);
    } else {
      console.log(`❌ Error: Unknown generation type: ${type}`);
    }
  });

program
  .command("build")
  .description("Build the backend for production")
  .action(() => {
    buildBackend();
  });

program
  .command("prisma")
  .description("Prisma utilities")
  .argument("<subcommand>", "generate | migrate")
  .action((subcommand) => {
    handlePrisma(subcommand);
  });

// Handle default action (no command)
if (!process.argv.slice(2).length) {
  initProject();
} else {
  program.parse(process.argv);
}

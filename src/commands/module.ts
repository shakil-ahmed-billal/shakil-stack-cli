import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import * as templates from "../templates/module.js";

export const generateModule = async (name: string) => {
  if (!name) {
    console.log(chalk.red("❌ Error: Module name is required."));
    process.exit(1);
  }

  const moduleName = name.charAt(0).toUpperCase() + name.slice(1);
  const lowercaseName = name.toLowerCase();

  // Check if inside a shakil-stack project
  const backendRoot = fs.existsSync("backend") ? "backend" : ".";
  const moduleDir = path.join(backendRoot, "src", "app", "module", moduleName);

  if (!fs.existsSync(path.join(backendRoot, "src", "app", "module"))) {
    console.log(
      chalk.red(
        "❌ Error: This command must be run inside your shakil-stack project root or backend directory."
      )
    );
    process.exit(1);
  }

  if (fs.existsSync(moduleDir)) {
    console.log(chalk.red(`❌ Error: Module ${moduleName} already exists.`));
    process.exit(1);
  }

  const spinner = ora(`🛠️ Generating module: ${chalk.cyan(moduleName)}...`).start();

  try {
    await fs.ensureDir(moduleDir);

    const files = {
      "controller.ts": templates.moduleController(moduleName, lowercaseName),
      "service.ts": templates.moduleService(moduleName, lowercaseName),
      "route.ts": templates.moduleRoute(moduleName, lowercaseName),
      "interface.ts": templates.moduleInterface(moduleName),
      "validation.ts": templates.moduleValidation(moduleName),
      "constant.ts": templates.moduleConstant(moduleName),
    };

    // Add Prisma schema for the module
    await fs.outputFile(
      path.join(backendRoot, "prisma", "schema", `${lowercaseName}.prisma`),
      templates.modulePrisma(moduleName)
    );

    for (const [ext, content] of Object.entries(files)) {
      await fs.outputFile(path.join(moduleDir, `${lowercaseName}.${ext}`), content);
    }

    spinner.succeed(chalk.green(`✅ Module ${moduleName} generated successfully! ✨`));
    console.log(chalk.gray(`Created at: ${moduleDir}`));
  } catch (error) {
    spinner.fail(chalk.red("❌ Failed to generate module."));
    console.error(error);
  }
};

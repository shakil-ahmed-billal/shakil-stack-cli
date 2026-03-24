import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { runCommand, getPackageManager } from "../utils/index.js";
import * as templates from "../templates/backend.js";

export const initProject = async (projectNameArg?: string) => {
  let projectName = projectNameArg;

  if (!projectName) {
    const response = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "What is your project name?",
        default: "shakil-stack-app",
      },
    ]);
    projectName = response.projectName;
  }

  if (!projectName) {
    console.log(chalk.red("❌ Error: Project name is required."));
    process.exit(1);
  }

  const { packageManager, useShadcn, installDeps } = await inquirer.prompt([
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager do you want to use?",
      choices: ["pnpm", "npm", "yarn"],
      default: getPackageManager(),
    },
    {
      type: "confirm",
      name: "useShadcn",
      message: "Would you like to use shadcn/ui?",
      default: true,
    },
    {
      type: "confirm",
      name: "installDeps",
      message: "Do you want to install dependencies automatically?",
      default: true,
    },
  ]);

  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Error: Directory ${projectName} already exists.`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n🚀 Initializing ${chalk.bold(projectName)}...\n`));

  const spinner = ora("🛠️ Creating project structure...").start();

  try {
    // Basic Structure
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "config"));
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "lib"));
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "module"));
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "routes"));
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "middleware"));
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "utils"));
    await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "errorHelpers"));
    await fs.ensureDir(path.join(projectPath, "backend", "prisma", "schema"));

    // Frontend Scaffold
    console.log(chalk.cyan("\n🖼️ Scaffolding Next.js frontend..."));
    runCommand(
      `npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-${packageManager}`,
      projectPath
    );

    // Initial Directories in Frontend
    const frontendExtraFolders = ["config", "hooks", "lib", "services", "types"];
    for (const folder of frontendExtraFolders) {
      await fs.ensureDir(path.join(projectPath, "frontend", "src", folder));
    }

    // Shadcn/UI initialization
    if (useShadcn) {
      console.log(chalk.cyan("\n🎨 Setting up shadcn/ui..."));
      try {
        runCommand(`npx shadcn@latest init -d`, path.join(projectPath, "frontend"));

        console.log(chalk.cyan("📦 Adding common shadcn/ui components..."));
        const commonComponents = [
          "button",
          "card",
          "input",
          "label",
          "textarea",
          "dialog",
          "dropdown-menu",
          "table",
          "tabs",
          "checkbox",
        ];
        runCommand(
          `npx shadcn@latest add ${commonComponents.join(" ")} -y`,
          path.join(projectPath, "frontend")
        );

        console.log(chalk.green("✅ shadcn/ui and common components initialized successfully!✨"));
      } catch (err) {
        console.log(
          chalk.yellow(
            '\n⚠️ Warning: Failed to automate shadcn/ui init. You can run "npx shadcn@latest init" in the frontend folder.'
          )
        );
      }
    }

    // Writing Backend Files
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "server.ts"),
      templates.serverTs(projectName)
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app.ts"),
      templates.appTs(projectName)
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "config", "index.ts"),
      templates.configTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "lib", "prisma.ts"),
      templates.prismaTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "lib", "auth.ts"),
      templates.authTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "routes", "index.ts"),
      templates.routesTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "middleware", "globalErrorHandler.ts"),
      templates.globalErrorHandlerTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "middleware", "notFound.ts"),
      templates.notFoundTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "middleware", "sanitizeRequest.ts"),
      templates.sanitizeRequestTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "utils", "catchAsync.ts"),
      templates.catchAsyncTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "utils", "sendResponse.ts"),
      templates.sendResponseTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "utils", "sanitizer.ts"),
      templates.sanitizerTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "errorHelpers", "ApiError.ts"),
      templates.apiErrorTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "prisma", "schema", "base.prisma"),
      templates.basePrisma
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "prisma", "schema", "user.prisma"),
      templates.userPrisma
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "prisma.config.ts"),
      templates.prismaConfigTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "tsconfig.json"),
      templates.tsconfigTs
    );
    await fs.outputFile(
      path.join(projectPath, "backend", ".gitignore"),
      "node_modules\ndist\n.env"
    );
    await fs.outputFile(
      path.join(projectPath, "backend", ".env"),
      'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nJWT_SECRET="your-secret-key"'
    );

    const backendPkg = {
      name: `${projectName}-backend`,
      version: "1.0.0",
      type: "module",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        dev: "nodemon --exec tsx src/server.ts",
        build:
          "prisma generate && tsup src/server.ts --format esm --platform node --target node20 --outDir dist --external pg-native",
        postinstall: "prisma generate",
        start: "node dist/server.js",
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:studio": "prisma studio",
        seed: "tsx prisma/seed.ts",
        setup:
          "pnpm install && pnpm add @prisma/adapter-pg pg && pnpm add -D @types/pg && pnpm prisma:generate",
        predev: "pnpm run prisma:generate",
        init: "pnpm run prisma:generate && pnpm run prisma:migrate --name init",
        lint: "eslint src/**/*.ts",
        "lint:fix": "eslint src/**/*.ts --fix",
        format: "prettier --write .",
        push: "prisma db push",
        pull: "prisma db pull",
      },
      dependencies: {
        "@prisma/adapter-pg": "^7.5.0",
        "@prisma/client": "^7.5.0",
        "better-auth": "^1.5.6",
        "cookie-parser": "^1.4.7",
        cors: "^2.8.6",
        dompurify: "^3.3.3",
        dotenv: "^17.3.1",
        express: "^5.2.1",
        "express-rate-limit": "^8.3.1",
        helmet: "^8.1.0",
        "http-status": "^2.1.0",
        jsdom: "^29.0.1",
        jsonwebtoken: "^9.0.3",
        morgan: "^1.10.1",
        pg: "^8.20.0",
        winston: "^3.19.0",
        zod: "^4.3.6",
      },
      devDependencies: {
        "@types/cookie-parser": "^1.4.10",
        "@types/cors": "^2.8.19",
        "@types/express": "^5.0.6",
        "@types/node": "^20.19.37",
        "@types/pg": "^8.20.0",
        "@types/morgan": "^1.9.10",
        "@types/jsdom": "^21.1.7",
        prisma: "^7.5.0",
        tsx: "^4.21.0",
        nodemon: "^3.1.14",
        tsup: "^8.5.1",
        typescript: "^5.9.3",
        eslint: "^9.21.0",
        prettier: "^3.5.2",
      },
    };
    await fs.writeJson(path.join(projectPath, "backend", "package.json"), backendPkg, { spaces: 2 });

    spinner.succeed(chalk.green(`✅ Project structure created! ✨`));

    if (installDeps) {
      console.log(chalk.yellow(`\n📦 Finalizing dependencies with ${packageManager}...\n`));
      runCommand(`${packageManager} install`, path.join(projectPath, "backend"));
    }

    console.log(chalk.cyan(`To get started:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  cd backend && ${packageManager} dev\n`));
    console.log(chalk.white(`  cd frontend && ${packageManager} dev\n`));
  } catch (error) {
    spinner.fail(chalk.red("❌ Failed to initialize project."));
    console.error(error);
    process.exit(1);
  }
};

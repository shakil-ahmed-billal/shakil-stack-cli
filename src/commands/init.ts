import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { runCommand, getPackageManager } from "../utils/index.js";
import * as templates from "../templates/backend/index.js";
import * as rootTemplates from "../templates/root/index.js";
import * as frontendAuthTemplates from "../templates/frontend/index.js";


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

  const { packageManager, useShadcn, installDeps, setupPrisma, setupBetterAuth, setupApi, setupLogin, setupDarkMode, setupNavbarFooter, setupDashboard, setupVercel, setupGit } = await inquirer.prompt([
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
      name: "setupPrisma",
      message: "Would you like to setup Prisma?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupBetterAuth",
      message: "Would you like to setup Better-Auth?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupApi",
      message: "Would you like to setup API modules (AuthController, etc.)?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupLogin",
      message: "Would you like to setup Frontend Login/Register pages?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupDarkMode",
      message: "Would you like to setup Dark Mode (next-themes)?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupNavbarFooter",
      message: "Would you like to add a Navbar & Footer (@shadcnblocks)?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupDashboard",
      message: "Would you like to setup a Dashboard with Sidebar?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupVercel",
      message: "Would you like to setup Vercel deployment configuration for the backend?",
      default: true,
    },
    {
      type: "confirm",
      name: "installDeps",
      message: "Do you want to install dependencies automatically?",
      default: true,
    },
    {
      type: "confirm",
      name: "setupGit",
      message: "Would you like to setup Git with automatic version control?",
      default: true,
    },
  ]);

  const isCurrentDir = projectName === "." || projectName === "./";
  const projectPath = isCurrentDir ? process.cwd() : path.join(process.cwd(), projectName);
  const displayProjectName = isCurrentDir ? path.basename(process.cwd()) : projectName;

  if (!isCurrentDir && fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Error: Directory ${projectName} already exists.`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n🚀 Initializing ${chalk.bold(displayProjectName)} in ${isCurrentDir ? "current directory" : projectName}...\n`));

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
    
    if (setupPrisma) {
        await fs.ensureDir(path.join(projectPath, "backend", "prisma", "schema"));
    }

    if (setupApi) {
        await fs.ensureDir(path.join(projectPath, "backend", "src", "app", "module", "auth"));
    }

    // Frontend Scaffold
    console.log(chalk.cyan("\n🖼️ Scaffolding Next.js frontend..."));
    runCommand(
      `npx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-${packageManager}`,
      projectPath
    );

    // Initial Directories in Frontend
    const frontendExtraFolders = ["config", "hooks", "lib", "services", "types"];
    if (setupApi) frontendExtraFolders.push("lib/axios");
    if (setupLogin) frontendExtraFolders.push("components/auth", "app/(auth)/login", "app/(auth)/register");
    if (setupDashboard) frontendExtraFolders.push("app/dashboard");
    if (setupNavbarFooter) frontendExtraFolders.push("app/(main)");
    
    for (const folder of frontendExtraFolders) {
      await fs.ensureDir(path.join(projectPath, "frontend", "src", folder));
    }

    // Writing Backend Files
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "server.ts"),
      templates.serverTs(displayProjectName)
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app.ts"),
      setupVercel ? templates.appTsWithVercel(displayProjectName) : templates.appTs(displayProjectName)
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "src", "app", "config", "index.ts"),
      templates.configTs
    );
    if (setupPrisma) {
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "lib", "prisma.ts"),
          templates.prismaTs
        );
    }
    
    if (setupBetterAuth) {
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "lib", "auth.ts"),
          setupVercel ? templates.authTsWithVercel : templates.authTs
        );
    }

    // ─── Vercel Deployment Config ─────────────────────────────────────────
    if (setupVercel) {
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "index.ts"),
          templates.vercelIndexTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "vercel.json"),
          templates.vercelJson
        );
        console.log(chalk.green("\n☁️  Vercel deployment config written to backend/vercel.json"));
        console.log(chalk.cyan("   Run \"pnpm build\" in backend, then \"vercel --prod\" to deploy."));
    }
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
      path.join(projectPath, "backend", "src", "app", "middleware", "validateRequest.ts"),
      templates.validateRequestTs
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
    if (setupPrisma) {
        await fs.outputFile(
          path.join(projectPath, "backend", "prisma", "schema", "schema.prisma"),
          templates.basePrisma
        );
        if (setupBetterAuth) {
            await fs.outputFile(
                path.join(projectPath, "backend", "prisma", "schema", "auth.prisma"),
                templates.userPrisma
            );
        }
        await fs.outputFile(
          path.join(projectPath, "backend", "prisma.config.ts"),
          templates.prismaConfigTs
        );
    }

    // Backend Auth Module
    if (setupApi) {
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "module", "auth", "auth.controller.ts"),
          templates.authControllerTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "module", "auth", "auth.service.ts"),
          templates.authServiceTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "module", "auth", "auth.route.ts"),
          templates.authRouteTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "module", "auth", "auth.interface.ts"),
          templates.authInterfaceTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "module", "auth", "auth.validation.ts"),
          templates.authValidationTs
        );

        // Backend Auth Utils
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "utils", "jwt.ts"),
          templates.jwtTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "utils", "cookie.ts"),
          templates.cookieTs
        );
        await fs.outputFile(
          path.join(projectPath, "backend", "src", "app", "utils", "token.ts"),
          templates.tokenTs
        );
    }

    // ─── Frontend Auth ─────────────────────────────────────────────────
    if (setupApi) {
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "lib", "axios", "httpClient.ts"),
          frontendAuthTemplates.httpClientTs
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "lib", "tokenUtils.ts"),
          frontendAuthTemplates.tokenUtilsTs
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "lib", "cookieUtils.ts"),
          frontendAuthTemplates.cookieUtilsTs
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "lib", "session.ts"),
          frontendAuthTemplates.sessionTs
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "services", "auth.actions.ts"),
          frontendAuthTemplates.authActionsTs
        );
    }

    if (setupLogin) {
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "auth", "login-form.tsx"),
          frontendAuthTemplates.loginFormTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "auth", "register-form.tsx"),
          frontendAuthTemplates.registerFormTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "app", "(auth)", "login", "page.tsx"),
          frontendAuthTemplates.authPageTsx('login')
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "app", "(auth)", "register", "page.tsx"),
          frontendAuthTemplates.authPageTsx('register')
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "app", "(auth)", "layout.tsx"),
          frontendAuthTemplates.authLayoutTsx
        );
    }

    // ─── Dark Mode ────────────────────────────────────────────────────────
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "theme-provider.tsx"),
      frontendAuthTemplates.themeProviderTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "theme-switcher.tsx"),
      frontendAuthTemplates.themeSwitcherTsx
    );

    // ─── Navbar + Footer ──────────────────────────────────────────────────
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "logo.tsx"),
      frontendAuthTemplates.logoTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "separator.tsx"),
      frontendAuthTemplates.separatorTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "navbar.tsx"),
      frontendAuthTemplates.navbarTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "user-avatar.tsx"),
      frontendAuthTemplates.userAvatarTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "footer.tsx"),
      frontendAuthTemplates.footerTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "social-links.tsx"),
      frontendAuthTemplates.socialLinksTsx
    );

    // (main) Layout for Navbar/Footer
    if (setupNavbarFooter) {
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "app", "(main)", "layout.tsx"),
          frontendAuthTemplates.mainLayoutTsx
        );
    }

    // ─── Dashboard ────────────────────────────────────────────────────────
    if (setupDashboard) {
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "app-sidebar.tsx"),
          frontendAuthTemplates.appSidebarTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "nav-main.tsx"),
          frontendAuthTemplates.navMainTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "nav-projects.tsx"),
          frontendAuthTemplates.navProjectsTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "nav-user.tsx"),
          frontendAuthTemplates.navUserTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "components", "team-switcher.tsx"),
          frontendAuthTemplates.teamSwitcherTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "app", "dashboard", "page.tsx"),
          frontendAuthTemplates.dashboardPageTsx
        );
        await fs.outputFile(
          path.join(projectPath, "frontend", "src", "app", "dashboard", "layout.tsx"),
          frontendAuthTemplates.dashboardLayoutTsx
        );
    }

    // ─── Landing Page ─────────────────────────────────────────────────────
    if (setupNavbarFooter) {
      // Delete the default page.tsx if we're using the (main) layout group
      await fs.remove(path.join(projectPath, "frontend", "src", "app", "page.tsx"));
    }
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "app", setupNavbarFooter ? "(main)/page.tsx" : "page.tsx"),
      frontendAuthTemplates.landingPageTsx
    );

    // ─── Providers + Layout ───────────────────────────────────────────────
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "components", "Providers.tsx"),
      frontendAuthTemplates.providersTsx
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", "src", "app", "layout.tsx"),
      frontendAuthTemplates.layoutTsx
    );

    // ─── MCP Config ───────────────────────────────────────────────────────
    await fs.outputFile(
      path.join(projectPath, "frontend", ".mcp.json"),
      frontendAuthTemplates.mcpJsonConfig
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", ".cursor", "mcp.json"),
      frontendAuthTemplates.mcpJsonConfig
    );
    await fs.outputFile(
      path.join(projectPath, "frontend", ".antigravity", "mcp.json"),
      frontendAuthTemplates.mcpJsonConfig
    );

    // ─── Branding Assets (Logo & Favicons) ────────────────────────────────
    try {
      // Use import.meta.url to safely resolve the exact directory of the bundled CLI in ESM
      const currentFileUrl = import.meta.url;
      const currentDir = path.dirname(fileURLToPath(currentFileUrl));
      
      await fs.copy(
        path.join(currentDir, "templates/public-assets"),
        path.join(projectPath, "frontend", "public"),
        { overwrite: true }
      );
      // Remove default Next.js favicon from /src/app so it doesn't conflict
      await fs.remove(path.join(projectPath, "frontend", "src", "app", "favicon.ico"));
      // Remove default Next.js placeholder SVGs from public/
      const defaultNextSvgs = ["file.svg", "globe.svg", "next.svg", "vercel.svg", "window.svg"];
      for (const svg of defaultNextSvgs) {
        await fs.remove(path.join(projectPath, "frontend", "public", svg));
      }
      console.log(chalk.green("✅ Branding assets copied to frontend/public/"));
    } catch (e) {
      console.log(chalk.yellow("⚠️  Could not copy branding assets. Copy them manually from the CLI package."));
    }

    // Shadcn/UI initialization
    if (useShadcn) {
      console.log(chalk.cyan("\n🎨 Setting up shadcn/ui..."));
      try {
        runCommand(`npx shadcn@latest init -d`, path.join(projectPath, "frontend"));

        console.log(chalk.cyan("📦 Adding common shadcn/ui components..."));
        const commonComponents = [
          "accordion",
          "avatar",
          "breadcrumb",
          "button",
          "card",
          "checkbox",
          "collapsible",
          "dialog",
          "dropdown-menu",
          "input",
          "label",
          "navigation-menu",
          "separator",
          "sheet",
          "sidebar",
          "skeleton",
          "sonner",
          "table",
          "tabs",
          "textarea",
          "tooltip",
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

    // ─── Custom UI Components ──────────────────────────────────────────────
    console.log(chalk.cyan("\n🧩 Writing custom UI components..."));
    const uiDir = path.join(projectPath, "frontend", "src", "components", "ui");
    await fs.ensureDir(uiDir);
    await fs.outputFile(
      path.join(uiDir, "field.tsx"),
      frontendAuthTemplates.fieldTsx
    );
    await fs.outputFile(
      path.join(uiDir, "dropdown-menu.tsx"),
      frontendAuthTemplates.dropdownMenuTsx
    );
    await fs.outputFile(
      path.join(uiDir, "collapsible.tsx"),
      frontendAuthTemplates.collapsibleTsx
    );
    await fs.outputFile(
      path.join(projectPath, "backend", "tsconfig.json"),
      templates.tsconfigTs(setupVercel)
    );
    await fs.outputFile(
      path.join(projectPath, ".gitignore"),
      rootTemplates.gitignore
    );
    await fs.outputFile(
      path.join(projectPath, "LICENSE"),
      rootTemplates.license
    );
    await fs.outputFile(
      path.join(projectPath, "README.md"),
      rootTemplates.readme(displayProjectName)
    );
    await fs.outputFile(
      path.join(projectPath, "CODE_OF_CONDUCT.md"),
      rootTemplates.codeOfConduct
    );
    const jwtSecret = crypto.randomBytes(32).toString("hex");
    const betterAuthSecret = crypto.randomBytes(32).toString("hex");

    const backendEnvContent = `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${displayProjectName}"
JWT_SECRET="${jwtSecret}"
BETTER_AUTH_SECRET="${betterAuthSecret}"
NODE_ENV="development"
PORT=8000
BETTER_AUTH_BASE_URL="http://localhost:8000"
CLIENT_URL="http://localhost:3000"`;

    const frontendEnvLocalContent = `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`;

    await fs.outputFile(path.join(projectPath, ".env"), backendEnvContent);
    await fs.outputFile(path.join(projectPath, "frontend", ".env.local"), frontendEnvLocalContent);
    await fs.outputFile(
      path.join(projectPath, "package.json"),
      rootTemplates.packageJson(displayProjectName)
    );

    if (packageManager === "pnpm") {
      await fs.outputFile(
        path.join(projectPath, "pnpm-workspace.yaml"),
        "packages:\n  - 'backend'\n  - 'frontend'\n"
      );
    }

    const backendPkg = {
      name: `${displayProjectName}-backend`,
      version: "1.0.0",
      type: "module",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        dev: "nodemon --exec tsx src/server.ts",
        build: setupVercel
          ? "prisma generate && tsup src/index.ts --format esm --platform node --target node20 --outDir api --external pg-native --external @prisma/client-runtime-utils"
          : "prisma generate && tsup src/server.ts --format esm --platform node --target node20 --outDir dist --external pg-native --external @prisma/client-runtime-utils",
        postinstall: "prisma generate",
        start: setupVercel ? "node api/index.js" : "node dist/server.js",
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
        ...(setupPrisma ? {
            "@prisma/adapter-pg": "^7.5.0",
            "@prisma/client": "^7.5.0",
            "pg": "^8.20.0",
        } : {}),
        ...(setupBetterAuth ? { "better-auth": "^1.5.6" } : {}),
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
        winston: "^3.19.0",
        zod: "^4.3.6",
      },
      devDependencies: {
        "@types/cookie-parser": "^1.4.10",
        "@types/jsonwebtoken": "^9.0.7",
        "@types/cors": "^2.8.19",
        "@types/express": "^5.0.6",
        "@types/node": "^20.19.37",
        ...(setupPrisma ? { "@types/pg": "^8.20.0", "prisma": "^7.5.0" } : {}),
        "@types/morgan": "^1.9.10",
        "@types/jsdom": "^21.1.7",
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
      runCommand(`${packageManager} install`, projectPath); // Install in root
      runCommand(`${packageManager} install`, path.join(projectPath, "backend"));
      
      console.log(chalk.yellow(`\n📦 Adding frontend dependencies...\n`));

      // Core UI / styling deps (always installed)
      const coreDeps = [
        "lucide-react@latest",
        "sonner",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
        "tailwindcss-animate",
      ];

      // Auth / form deps
      if (setupApi || setupLogin) {
        coreDeps.push("axios");
      }
      if (setupLogin) {
        coreDeps.push("react-hook-form", "zod", "@hookform/resolvers", "@tanstack/react-query");
      }
      if (setupDarkMode) {
        coreDeps.push("next-themes@^0.4.4");
      }

      const addCommand = packageManager === "pnpm"
        ? `${packageManager} add ${coreDeps.join(" ")} --filter ./frontend`
        : `${packageManager} add ${coreDeps.join(" ")}`;

      runCommand(addCommand, projectPath);
    }

    // Setup Git
    if (setupGit) {
      console.log(chalk.cyan("\n Git Initializing..."));
      try {
        // Remove nested .git in frontend if exists
        const frontendGitPath = path.join(projectPath, "frontend", ".git");
        if (fs.existsSync(frontendGitPath)) {
          await fs.remove(frontendGitPath);
        }

        runCommand(`git init`, projectPath);
        runCommand(`git add .`, projectPath);
        runCommand(`git commit -m "Initial commit from shakil-stack"`, projectPath);
        console.log(chalk.green(" Git initialized successfully!"));
      } catch (err) {
        console.log(chalk.yellow("⚠️ Warning: Failed to initialize Git."));
      }
    }

    console.log(chalk.cyan(`\n🔥 Your project is ready! Follow these steps to start:\n`));
    if (projectName !== "./" && projectName !== ".") {
      console.log(chalk.white(`  1. ${chalk.bold(`cd ${projectName}`)}`));
    }
    console.log(chalk.white(`  2. Ensure your ${chalk.bold("PostgreSQL")} database is running.`));
    console.log(chalk.white(`  3. Update ${chalk.bold(".env")} credentials if needed.`));
    console.log(chalk.white(`  4. ${chalk.bold(`pnpm dev:backend`)} (Starts server & Prisma Studio)`));
    console.log(chalk.white(`  5. ${chalk.bold(`pnpm dev:frontend`)} (Starts Next.js application)`));
    console.log(chalk.green(`\nHappy coding! 🚀\n`));
  } catch (error) {
    spinner.fail(chalk.red("❌ Failed to initialize project."));
    console.error(error);
    process.exit(1);
  }
};

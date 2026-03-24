import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import * as templates from "../templates/backend.js";
import * as rootTemplates from "../templates/root.js";

export const updateProject = async () => {
    const projectPath = process.cwd();
    const backendPath = path.join(projectPath, "backend");
    const projectName = path.basename(projectPath);

    if (!fs.existsSync(backendPath)) {
        console.log(chalk.red("❌ Error: Not in a shakil-stack project root (backend folder not found)."));
        process.exit(1);
    }

    const spinner = ora("🔄 Updating project structure...").start();

    try {
        // 1. Relocate .env from backend to root if needed
        const oldEnvPath = path.join(backendPath, ".env");
        const newEnvPath = path.join(projectPath, ".env");

        let envContent = "";
        if (fs.existsSync(oldEnvPath)) {
            envContent = await fs.readFile(oldEnvPath, "utf-8");
            if (!fs.existsSync(newEnvPath)) {
                await fs.move(oldEnvPath, newEnvPath);
                console.log(chalk.yellow("\n📝 Moved .env from backend/ to root."));
            } else {
                // If both exist, merge or at least ensure new variables are there
                console.log(chalk.yellow("\n⚠️ Both backend/.env and root .env exist. Merging..."));
                await fs.remove(oldEnvPath);
            }
        } else if (fs.existsSync(newEnvPath)) {
            envContent = await fs.readFile(newEnvPath, "utf-8");
        }

        // 2. Ensure new environment variables are present
        const requiredEnvVars = [
            `BETTER_AUTH_BASE_URL="http://localhost:8000"`,
            `CLIENT_URL="http://localhost:3000"`
        ];

        let updatedEnvContent = envContent;
        for (const envVar of requiredEnvVars) {
            const varName = envVar.split("=")[0] as string;
            if (!updatedEnvContent.includes(varName)) {
                updatedEnvContent += `\n${envVar}`;
            }
        }

        if (updatedEnvContent !== envContent) {
            await fs.outputFile(newEnvPath, updatedEnvContent.trim() + "\n");
            console.log(chalk.green("✅ Updated root .env with missing variables."));
        }

        // 3. Update Backend Templates (Boilerplate files)
        const filesToUpdate = [
            { path: path.join(backendPath, "src", "app", "config", "index.ts"), content: templates.configTs },
            { path: path.join(backendPath, "src", "app", "lib", "prisma.ts"), content: templates.prismaTs },
            { path: path.join(backendPath, "src", "app", "lib", "auth.ts"), content: templates.authTs },
            { path: path.join(backendPath, "prisma", "schema", "schema.prisma"), content: templates.basePrisma },
            { path: path.join(backendPath, "prisma.config.ts"), content: templates.prismaConfigTs }
        ];

        for (const file of filesToUpdate) {
            await fs.outputFile(file.path, file.content);
        }

        // 4. Add Root Meta Files if missing
        const rootFiles = [
            { path: path.join(projectPath, ".gitignore"), content: rootTemplates.gitignore },
            { path: path.join(projectPath, "LICENSE"), content: rootTemplates.license },
            { path: path.join(projectPath, "README.md"), content: rootTemplates.readme(projectName) },
            { path: path.join(projectPath, "CODE_OF_CONDUCT.md"), content: rootTemplates.codeOfConduct }
        ];

        for (const file of rootFiles) {
            if (!fs.existsSync(file.path)) {
                await fs.outputFile(file.path, file.content);
                console.log(chalk.cyan(`📄 Added ${path.basename(file.path)} to root.`));
            }
        }

        // 5. Cleanup backend/.gitignore if it contains .env
        const backendGitIgnorePath = path.join(backendPath, ".gitignore");
        if (fs.existsSync(backendGitIgnorePath)) {
            let gitIgnoreContent = await fs.readFile(backendGitIgnorePath, "utf-8");
            if (gitIgnoreContent.includes(".env")) {
                gitIgnoreContent = gitIgnoreContent.replace(/\.env\n?/, "").trim();
                await fs.outputFile(backendGitIgnorePath, gitIgnoreContent + "\n");
            }
        }

        spinner.succeed(chalk.green("✅ Project updated successfully! ✨"));
        console.log(chalk.cyan("\nNext Steps:"));
        console.log(chalk.white("1. Check your root .env file and update credentials if needed."));
        console.log(chalk.white("2. Run 'shakil-stack prisma generate' to update the Prisma client."));

    } catch (error) {
        spinner.fail(chalk.red("❌ Failed to update project."));
        console.error(error);
        process.exit(1);
    }
};

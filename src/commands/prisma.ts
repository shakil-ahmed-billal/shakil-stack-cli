import fs from "fs-extra";
import chalk from "chalk";
import { runCommand, getPackageManager } from "../utils/index.js";

export const handlePrisma = async (subcommand: string) => {
    const backendRoot = fs.existsSync('backend') ? 'backend' : '.';
    if (subcommand === 'generate') {
      console.log(chalk.cyan('🔄 Generating Prisma client...'));
      runCommand('npx prisma generate', backendRoot);
    } else if (subcommand === 'migrate') {
      console.log(chalk.cyan('🚀 Running Prisma migrations...'));
      runCommand('npx prisma migrate dev', backendRoot);
    } else {
      console.log(chalk.red(`❌ Error: Unknown prisma subcommand: ${subcommand}`));
    }
};

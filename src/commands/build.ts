import fs from "fs-extra";
import chalk from "chalk";
import { runCommand, getPackageManager } from "../utils/index.js";

export const buildBackend = async () => {
    const pm = getPackageManager();
    const backendRoot = fs.existsSync('backend') ? 'backend' : '.';
    console.log(chalk.cyan(`🏗️ Building backend with ${pm}...`));
    runCommand(`${pm} run build`, backendRoot);
};

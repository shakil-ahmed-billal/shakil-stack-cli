import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

/**
 * Runs a shell command and returns the output.
 */
export const runCommand = (command: string, cwd: string = process.cwd()) => {
  try {
    execSync(command, { 
      stdio: "inherit", 
      cwd,
      env: { 
        ...process.env, 
        NPM_CONFIG_UPDATE_NOTIFIER: "false",
        NPM_CONFIG_LOGLEVEL: "error",
        NEXT_TELEMETRY_DISABLED: "1"
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Detects the package manager being used (pnpm, npm, yarn).
 */
export const getPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("yarn")) return "yarn";
  return "pnpm";
};

/**
 * Ensures a directory exists.
 */
export const ensureDirectory = async (dirPath: string) => {
  await fs.ensureDir(dirPath);
};

/**
 * Writes a string to a file.
 */
export const writeFile = async (filePath: string, content: string) => {
  await fs.outputFile(filePath, content);
};

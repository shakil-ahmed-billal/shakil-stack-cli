#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const program = new Command();

// --- Utils ---
const getPackageManager = () => {
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  return 'npm';
};

const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { stdio: 'inherit', cwd });
  } catch (err) {
    // console.error(chalk.red(`Failed to execute: ${command}`));
  }
};

// --- Command: Init ---
const initProject = async (name) => {
  console.log(chalk.cyan('\n🚀 Initializing Shakil-Stack Project Generator...\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: name || 'my-new-project',
      validate: (input) => (input ? true : 'Project name is required'),
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: ['pnpm', 'npm', 'yarn'],
      default: 'pnpm',
    },
    {
      type: 'confirm',
      name: 'useShadcn',
      message: 'Would you like to use shadcn/ui for components?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Would you like to install dependencies now?',
      default: true,
    },
  ]);

  const { projectName, packageManager, installDeps, useShadcn } = answers;
  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\n❌ Error: Directory ${projectName} already exists.\n`));
    process.exit(1);
  }

  try {
    await fs.ensureDir(projectPath);
    const spinner = ora(`🚀 Creating project: ${chalk.cyan(projectName)}...`).start();

    // Backend Folder Structure
    const backendDirs = [
      'prisma',
      'src/app/config',
      'src/app/errorHelpers',
      'src/app/interfaces',
      'src/app/lib',
      'src/app/middleware',
      'src/app/module',
      'src/app/routes',
      'src/app/utils',
    ];

    spinner.text = `📂 Creating backend folder structure...`;
    for (const dir of backendDirs) {
      await fs.ensureDir(path.join(projectPath, 'backend', dir));
    }

    // Frontend (create-next-app)
    spinner.text = `📦 Running create-next-app for frontend...`;
    spinner.stop(); 
    const nextAppCmd = `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-${packageManager} --no-git`;
    try {
      execSync(nextAppCmd, { cwd: projectPath, stdio: 'inherit' });
    } catch (err) {
      console.log(chalk.yellow('\n⚠️ Warning: Failed to generate frontend via create-next-app. Building manually...'));
      await fs.ensureDir(path.join(projectPath, 'frontend'));
    }

    // Frontend extra folders
    const frontendExtraFolders = ['config', 'hooks', 'lib', 'services', 'types'];
    for (const folder of frontendExtraFolders) {
        await fs.ensureDir(path.join(projectPath, 'frontend', 'src', folder));
    }

    // Shadcn/UI initialization
    if (useShadcn) {
        console.log(chalk.cyan('\n🎨 Setting up shadcn/ui...'));
        try {
            // Using non-interactive init with default settings
            // -d flag uses default options: TypeScript, Tailwind, Lucide Icons, Slate color, css variables
            execSync(`npx shadcn@latest init -d`, { 
                cwd: path.join(projectPath, 'frontend'), 
                stdio: 'inherit' 
            });

            console.log(chalk.cyan('📦 Adding common shadcn/ui components...'));
            const commonComponents = ['button', 'card', 'input', 'label', 'textarea', 'dialog', 'dropdown-menu', 'table', 'tabs', 'checkbox'];
            execSync(`npx shadcn@latest add ${commonComponents.join(' ')} -y`, { 
                cwd: path.join(projectPath, 'frontend'), 
                stdio: 'inherit' 
            });

            console.log(chalk.green('✅ shadcn/ui and common components initialized successfully!✨'));
        } catch (err) {
            console.log(chalk.yellow('\n⚠️ Warning: Failed to automate shadcn/ui init. You can run "npx shadcn@latest init" in the frontend folder.'));
        }
    }

    spinner.start(`📂 Finalizing root files and backend code...`);

    // Root Files
    await fs.outputFile(path.join(projectPath, '.env'), 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nPORT=8000\nNODE_ENV=development\nJWT_SECRET="your-secret-key"');
    await fs.outputFile(path.join(projectPath, '.gitignore'), 'node_modules\n.env\ndist\n*.db\n.next\n.DS_Store');
    await fs.outputFile(path.join(projectPath, 'README.md'), `# ${projectName}\n\nGenerated with Full Shakil-Stack CLI.`);

    // Backend Files Templates
    const serverTs = `import { Server } from 'http';
import app from './app.js';
import config from './app/config/index.js';

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(\`${projectName} server is listening on port \${config.port}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();
`;

    const appTs = `import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middleware/globalErrorHandler.js';
import notFound from './app/middleware/notFound.js';
import router from './app/routes/index.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { sanitizeRequest } from './app/middleware/sanitizeRequest.js';

const app: Application = express();

app.use(helmet());
app.use(cors({ 
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use('/api/v1/auth', authLimiter);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeRequest);
app.use(morgan("dev"));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to ${projectName} API',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
`;

    const configTs = `import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 8000,
    database_url: process.env.DATABASE_URL,
    jwt_secret: process.env.JWT_SECRET,
};
`;

    const prismaTs = `import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import pkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import config from '../config/index.js';

const { Pool } = pkg;
const connectionString = config.database_url as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export default prisma;
export { prisma };
`;

    const authTs = `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import config from "../config/index.js";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: config.jwt_secret,
  baseURL: "http://localhost:8000",
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
});
`;

    const routesTs = `import { Router } from 'express';
const router = Router();
export default router;
`;

    const globalErrorHandlerTs = `import { ErrorRequestHandler } from 'express';
import config from '../config/index.js';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message || 'Something went wrong!',
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
`;

    const notFoundTs = `import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
  });
};

export default notFound;
`;

    const catchAsyncTs = `import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default catchAsync;
`;

    const apiErrorTs = `class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string | undefined, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
export default ApiError;
`;

    const sanitizerTs = `import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

export const sanitize = (data: any): any => {
    if (typeof data === 'string') return DOMPurify.sanitize(data);
    if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = sanitize(data[key]);
        }
    }
    return data;
};
`;

    const sanitizeRequestTs = `import { Request, Response, NextFunction } from 'express';
import { sanitize } from '../utils/sanitizer.js';

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};
`;

    const schemaPrisma = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id @default(uuid())
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
`;

    const prismaConfigTs = `import "dotenv/config";
import { defineConfig } from "prisma/config";
import process from "process";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
`;

    const tsconfigTs = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;

    const sendResponseTs = `import { Response } from 'express';

type IResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    limit: number;
    page: number;
    total: number;
  };
  data: T;
};

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || null,
    meta: data.meta || null,
    data: data.data || null,
  });
};

export default sendResponse;
`;

    // Writing Backend Files
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'server.ts'), serverTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app.ts'), appTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'config', 'index.ts'), configTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'lib', 'prisma.ts'), prismaTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'lib', 'auth.ts'), authTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'routes', 'index.ts'), routesTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'middleware', 'globalErrorHandler.ts'), globalErrorHandlerTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'middleware', 'notFound.ts'), notFoundTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'middleware', 'sanitizeRequest.ts'), sanitizeRequestTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'utils', 'catchAsync.ts'), catchAsyncTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'utils', 'sendResponse.ts'), sendResponseTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'utils', 'sanitizer.ts'), sanitizerTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'errorHelpers', 'ApiError.ts'), apiErrorTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'prisma', 'schema.prisma'), schemaPrisma);
    await fs.outputFile(path.join(projectPath, 'backend', 'prisma.config.ts'), prismaConfigTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'tsconfig.json'), tsconfigTs);
    await fs.outputFile(path.join(projectPath, 'backend', '.gitignore'), 'node_modules\ndist\n.env');
    await fs.outputFile(path.join(projectPath, 'backend', '.env'), 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nJWT_SECRET="your-secret-key"');

    const backendPkg = {
      name: `${projectName}-backend`,
      version: '1.0.0',
      type: "module",
      scripts: {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "nodemon --exec tsx src/server.ts",
        "build": "prisma generate && tsup src/server.ts --format esm --platform node --target node20 --outDir dist --external pg-native",
        "postinstall": "prisma generate",
        "start": "node dist/server.js",
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:studio": "prisma studio",
        "seed": "tsx prisma/seed.ts",
        "setup": "pnpm install && pnpm add @prisma/adapter-pg pg && pnpm add -D @types/pg && pnpm prisma:generate",
        "predev": "pnpm run prisma:generate",
        "init": "pnpm run prisma:generate && pnpm run prisma:migrate --name init",
        "lint": "eslint src/**/*.ts",
        "lint:fix": "eslint src/**/*.ts --fix",
        "format": "prettier --write .",
        "push": "prisma db push",
        "pull": "prisma db pull"
      },
      dependencies: {
        "@prisma/adapter-pg": "^7.5.0",
        "@prisma/client": "^7.5.0",
        "better-auth": "^1.5.6",
        "cookie-parser": "^1.4.7",
        "cors": "^2.8.6",
        "dompurify": "^3.3.3",
        "dotenv": "^17.3.1",
        "express": "^5.2.1",
        "express-rate-limit": "^8.3.1",
        "helmet": "^8.1.0",
        "http-status": "^2.1.0",
        "jsdom": "^29.0.1",
        "jsonwebtoken": "^9.0.3",
        "morgan": "^1.10.1",
        "pg": "^8.20.0",
        "winston": "^3.19.0",
        "zod": "^4.3.6"
      },
      devDependencies: {
        "@types/cookie-parser": "^1.4.10",
        "@types/cors": "^2.8.19",
        "@types/express": "^5.0.6",
        "@types/node": "^20.19.37",
        "@types/pg": "^8.20.0",
        "@types/morgan": "^1.9.10",
        "@types/jsdom": "^21.1.7",
        "prisma": "^7.5.0",
        "tsx": "^4.21.0",
        "nodemon": "^3.1.14",
        "tsup": "^8.5.1",
        "typescript": "^5.9.3",
        "eslint": "^9.21.0",
        "prettier": "^3.5.2"
      }
    };
    await fs.writeJson(path.join(projectPath, 'backend', 'package.json'), backendPkg, { spaces: 2 });

    spinner.succeed(chalk.green(`✅ Project structure created! ✨`));

    if (installDeps) {
      console.log(chalk.yellow(`\n📦 Finalizing dependencies with ${packageManager}...\n`));
      runCommand(`cd "${path.join(projectPath, 'backend')}" && ${packageManager} install`);
    }

    console.log(chalk.cyan(`To get started:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  cd backend && ${packageManager} dev\n`));
    console.log(chalk.white(`  cd frontend && ${packageManager} dev\n`));

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// --- Command: Generate Module ---
const generateModule = async (name) => {
  if (!name) {
    console.log(chalk.red('❌ Error: Module name is required.'));
    process.exit(1);
  }

  const moduleName = name.charAt(0).toUpperCase() + name.slice(1);
  const lowercaseName = name.toLowerCase();
  
  // Check if inside a shakil-stack project
  const backendRoot = fs.existsSync('backend') ? 'backend' : '.';
  const moduleDir = path.join(backendRoot, 'src', 'app', 'module', moduleName);

  if (!fs.existsSync(path.join(backendRoot, 'src', 'app', 'module'))) {
    console.log(chalk.red('❌ Error: This command must be run inside your shakil-stack project root or backend directory.'));
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
      'controller.ts': `import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { ${moduleName}Service } from './${lowercaseName}.service.js';

const create${moduleName} = catchAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.create${moduleName}IntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '${moduleName} created successfully',
    data: result,
  });
});

export const ${moduleName}Controller = {
  create${moduleName},
};
`,
      'service.ts': `import { ${moduleName} } from '@prisma/client';
import prisma from '../../lib/prisma.js';

const create${moduleName}IntoDB = async (payload: any) => {
  // Logic here
  return payload;
};

export const ${moduleName}Service = {
  create${moduleName}IntoDB,
};
`,
      'route.ts': `import { Router } from 'express';
import { ${moduleName}Controller } from './${lowercaseName}.controller.js';

const router = Router();

router.post('/create-${lowercaseName}', ${moduleName}Controller.create${moduleName});

export const ${moduleName}Routes = router;
`,
      'interface.ts': `export type I${moduleName} = {
  // Define interface
};
`,
      'validation.ts': `import { z } from 'zod';

const create${moduleName}ValidationSchema = z.object({
  body: z.object({
    // Define schema
  }),
});

export const ${moduleName}Validations = {
  create${moduleName}ValidationSchema,
};
`,
      'constant.ts': `export const ${moduleName}SearchableFields = [];
`,
    };

    for (const [ext, content] of Object.entries(files)) {
      await fs.outputFile(path.join(moduleDir, `${lowercaseName}.${ext}`), content);
    }

    spinner.succeed(chalk.green(`✅ Module ${moduleName} generated successfully! ✨`));
    console.log(chalk.gray(`Created at: ${moduleDir}`));

  } catch (error) {
    spinner.fail(chalk.red('❌ Failed to generate module.'));
    console.error(error);
  }
};

// --- CLI Structure ---
const packageJson = require('../package.json');

program
  .name('shakil-stack')
  .description('Full-stack EchoNet-style project generator CLI')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize a new full-stack project')
  .argument('[projectName]', 'Name of the project')
  .action((projectName) => {
    initProject(projectName);
  });

program
  .command('generate')
  .alias('g')
  .description('Generate a new module')
  .argument('<type>', 'Type of generation (module)')
  .argument('<name>', 'Name of the module')
  .action((type, name) => {
    if (type === 'module') {
      generateModule(name);
    } else {
      console.log(chalk.red(`❌ Error: Unknown generation type: ${type}`));
    }
  });

program
  .command('build')
  .description('Build the backend for production')
  .action(() => {
    const pm = getPackageManager();
    const backendRoot = fs.existsSync('backend') ? 'backend' : '.';
    console.log(chalk.cyan(`🏗️ Building backend with ${pm}...`));
    runCommand(`${pm} run build`, backendRoot);
  });

program
  .command('prisma')
  .description('Prisma utilities')
  .argument('<subcommand>', 'generate | migrate')
  .action((subcommand) => {
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
  });

// Handle default action (no command)
if (!process.argv.slice(2).length) {
    initProject();
} else {
    program.parse(process.argv);
}

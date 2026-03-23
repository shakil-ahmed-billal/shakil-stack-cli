#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

async function main() {
  console.log(chalk.cyan('\n🚀 Initializing Shakil-Stack Project Generator...\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: 'my-new-project',
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
      name: 'installDeps',
      message: 'Would you like to install dependencies now?',
      default: true,
    },
  ]);

  const { projectName, packageManager, installDeps } = answers;
  const projectPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\n❌ Error: Directory ${projectName} already exists.\n`));
    process.exit(1);
  }

  try {
    // 1. Create Root Directory
    await fs.ensureDir(projectPath);

    const spinner = ora(`🚀 Creating project: ${chalk.cyan(projectName)}...`).start();

    // 2. Define Backend Folder Structure
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

    // 3. Generate Frontend using create-next-app FIRST
    spinner.text = `📦 Running create-next-app for frontend...`;
    spinner.stop(); 
    
    const nextAppCmd = `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-${packageManager} --no-git`;
    try {
      execSync(nextAppCmd, { cwd: projectPath, stdio: 'inherit' });
    } catch (err) {
      console.log(chalk.yellow('\n⚠️ Warning: Failed to generate frontend via create-next-app. Building manually...'));
      await fs.ensureDir(path.join(projectPath, 'frontend'));
    }

    // 4. Create additional frontend folders AFTER create-next-app
    const frontendExtraFolders = ['config', 'hooks', 'lib', 'services', 'types'];
    for (const folder of frontendExtraFolders) {
        await fs.ensureDir(path.join(projectPath, 'frontend', 'src', folder));
    }

    spinner.start(`📂 Finalizing root files and backend code...`);

    // 5. Root Files
    await fs.outputFile(path.join(projectPath, '.env'), 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nPORT=8000\nNODE_ENV=development\nJWT_SECRET="your-secret-key"');
    await fs.outputFile(path.join(projectPath, '.gitignore'), 'node_modules\n.env\ndist\n*.db\n.next\n.DS_Store');
    await fs.outputFile(path.join(projectPath, 'README.md'), `# ${projectName}\n\nGenerated with Full EchoNet-style CLI.`);

    // 6. Backend Files (Refined)
    
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

    // Write backend files
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
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'utils', 'sanitizer.ts'), sanitizerTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'src', 'app', 'errorHelpers', 'ApiError.ts'), apiErrorTs);
    await fs.outputFile(path.join(projectPath, 'backend', 'prisma', 'schema.prisma'), schemaPrisma);
    await fs.outputFile(path.join(projectPath, 'backend', '.env'), 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\nJWT_SECRET="your-secret-key"');

    // Backend package.json
    const backendPkg = {
      name: `${projectName}-backend`,
      version: '1.0.0',
      type: "module",
      scripts: {
        "dev": "nodemon --exec tsx src/server.ts",
        "build": "tsup src/server.ts --format esm --platform node --target node20 --outDir dist",
        "start": "node dist/server.js",
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
        "typescript": "^5.9.3"
      }
    };
    await fs.writeJson(path.join(projectPath, 'backend', 'package.json'), backendPkg, { spaces: 2 });

    spinner.succeed(chalk.green(`✅ Project structure created! ✨`));

    // 7. Dependency Installation
    if (installDeps) {
      console.log(chalk.yellow(`\n📦 Finalizing dependencies with ${packageManager}...\n`));
      try {
        execSync(`cd "${path.join(projectPath, 'backend')}" && ${packageManager} install`, { stdio: 'inherit' });
        console.log(chalk.green(`\n✅ Backend dependencies installed! ✨\n`));
      } catch (err) {
        console.log(chalk.red(`\n❌ Step failed. You can manually run '${packageManager} install' in the backend folder.\n`));
      }
    }

    console.log(chalk.cyan(`To get started:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  cd backend && ${packageManager} dev\n`));
    console.log(chalk.white(`  cd frontend && ${packageManager} dev\n`));

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

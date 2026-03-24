export const serverTs = (projectName: string) => `import { Server } from 'http';
import app from './app.js';
import config from './app/config/index.js';

async function bootstrap() {
  try {
    const server: Server = app.listen(config.port, () => {
      console.log(\`🚀 Server is running on http://localhost:\${config.port}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();
`;

export const appTs = (projectName: string) => `import cors from 'cors';
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

export const configTs = `import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), "..", ".env") });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 8000,
    database_url: process.env.DATABASE_URL,
    jwt_secret: process.env.JWT_SECRET,
};
`;

export const prismaTs = `import "dotenv/config";
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

export const authTs = `import { betterAuth } from "better-auth";
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

export const routesTs = `import { Router } from 'express';
const router = Router();
export default router;
`;

export const globalErrorHandlerTs = `import { ErrorRequestHandler } from 'express';
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

export const notFoundTs = `import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
  });
};

export default notFound;
`;

export const catchAsyncTs = `import { NextFunction, Request, RequestHandler, Response } from 'express';

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

export const apiErrorTs = `class ApiError extends Error {
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

export const sanitizerTs = `import { JSDOM } from 'jsdom';
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

export const sanitizeRequestTs = `import { Request, Response, NextFunction } from 'express';
import { sanitize } from '../utils/sanitizer.js';

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};
`;

export const sendResponseTs = `import { Response } from 'express';

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

export const basePrisma = `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
  output   = "../../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
`;

export const userPrisma = `model User {
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

export const prismaConfigTs = `import "dotenv/config";
import { defineConfig } from "prisma/config";
import process from "process";

export default defineConfig({
  schema: "prisma/schema",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
`;

export const tsconfigTs = `{
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

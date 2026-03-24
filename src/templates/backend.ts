export const serverTs = (projectName: string) => `import { Server } from 'http';
import app from './app.js';
import config from './app/config/index.js';

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(\`🚀 Server is running on http://localhost:\${config.port}\`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log('🛑 Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error('❌ Unexpected error:', error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      console.log('SIGTERM received');
      if (server) {
        server.close();
      }
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
import config from './app/config/index.js';

const app: Application = express();

app.use(helmet());
app.use(cors({ 
    origin: [config.client_url as string, "http://localhost:3000", "http://127.0.0.1:3000"], 
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
    better_auth_secret: process.env.BETTER_AUTH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    better_auth_base_url: process.env.BETTER_AUTH_BASE_URL,
    client_url: process.env.CLIENT_URL,
};
`;

export const prismaTs = `import "dotenv/config";
import { PrismaClient } from "../../../generated/prisma/index.js";
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
  secret: config.better_auth_secret,
  baseURL: config.better_auth_base_url,
  trustedOrigins: [config.client_url as string],
  emailAndPassword: {
    enabled: true,
  },
});
`;

export const routesTs = `import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

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

export const prismaConfigTs = `import dotenv from "dotenv";
import path from "path";
import process from "process";
import { defineConfig } from "prisma/config";

dotenv.config({ path: path.join(process.cwd(), "..", ".env") });

export default defineConfig({
  schema: "prisma/schema",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
`;

export const jwtTs = `import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const createToken = (payload: Record<string, unknown>, secret: string, options: SignOptions) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded as JwtPayload };
  } catch (error) {
    return { success: false, error };
  }
};

export const jwtUtils = { createToken, verifyToken };
`;

export const cookieTs = `import { CookieOptions, Request, Response } from "express";

const setCookie = (res: Response, key: string, value: string, options: CookieOptions) => {
    res.cookie(key, value, options);
}

const getCookie = (req: Request, key: string) => {
    return req.cookies?.[key];
}

const clearCookie = (res: Response, key: string, options: CookieOptions) => {
    res.clearCookie(key, options);
}

export const CookieUtils = {
    setCookie,
    getCookie,
    clearCookie,
};
`;

export const tokenTs = `import { Response } from "express";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../config/index.js";
import { jwtUtils } from "./jwt.js";

const getAccessToken = (payload: JwtPayload) => {
    return jwtUtils.createToken(
        payload,
        config.jwt_secret as string,
        { expiresIn: config.jwt_access_expires_in } as SignOptions
    );
}

const getRefreshToken = (payload: JwtPayload) => {
    return jwtUtils.createToken(
        payload,
        config.jwt_secret as string,
        { expiresIn: config.jwt_refresh_expires_in } as SignOptions
    );
}

export const setAccessTokenCookie = (res: Response, token: string) => {
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: config.env === 'production' ? 'none' : 'lax',
        maxAge: 3600000, // 1 hour
        path: '/',
    });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: config.env === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    });
};

export const setBetterAuthSessionCookie = (res: Response, token: string) => {
    res.cookie('better-auth.session_token', token, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: config.env === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    });
};

export const tokenUtils = { getAccessToken, getRefreshToken, setAccessTokenCookie, setRefreshTokenCookie, setBetterAuthSessionCookie };
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
export const validateRequestTs = `import { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
`;

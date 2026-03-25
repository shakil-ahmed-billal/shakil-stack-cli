export const serverTs = (projectName: string) => `import { Server } from 'http';
import app from './app.js';
import config from './app/config/index.js';

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(\`\u{1F680} Server is running on http://localhost:\${config.port}\`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log('\u{1F6D1} Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error('\u274C Unexpected error:', error);
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


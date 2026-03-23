import cors from 'cors';
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
    message: 'Welcome to my-new-project API',
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;

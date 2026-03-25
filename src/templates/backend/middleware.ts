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

export const sanitizeRequestTs = `import { Request, Response, NextFunction } from 'express';
import { sanitize } from '../utils/sanitizer.js';

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};
`;

export const validateRequestTs = `import { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
`;


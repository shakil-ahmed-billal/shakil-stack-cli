import { ErrorRequestHandler } from 'express';
import config from '../config/index.js';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message || 'Something went wrong!',
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;

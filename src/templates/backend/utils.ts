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


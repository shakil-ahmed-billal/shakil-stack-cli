export const authControllerTs = `import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service.js";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { tokenUtils } from "../../utils/token.js";
import config from "../../config/index.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body);
    const { accessToken, refreshToken, token, ...rest } = result as Record<string, any>;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: { token, accessToken, refreshToken, ...rest }
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);
    const { accessToken, refreshToken, token, ...rest } = result as Record<string, any>;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: { token, accessToken, refreshToken, ...rest }
    });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const betterAuthSessionToken = req.cookies?.["better-auth.session_token"] || "";
    await AuthService.logoutUser(betterAuthSessionToken);

    const isProd = config.env === 'production';
    const cookieOptions = { 
        httpOnly: true, 
        secure: isProd, 
        sameSite: isProd ? "none" : "lax" as any,
        path: '/'
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.clearCookie('better-auth.session_token', cookieOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged out successfully",
        data: null
    });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User session retrieved successfully",
        data: { user }
    });
});

export const AuthController = { registerUser, loginUser, logoutUser, getMe };
`;

export const authServiceTs = `import status from "http-status";
import AppError from "../../errorHelpers/ApiError.js";
import { auth } from "../../lib/auth.js";
import { tokenUtils } from "../../utils/token.js";
import { ILoginUserPayload, IRegisterUserPayload } from "./auth.interface.js";

const registerUser = async (payload: IRegisterUserPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: { name, email, password: password || "" }
    });

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register user");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
    });

    return { ...data, accessToken, refreshToken };
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: { email, password: password || "" }
    });

    if (!data.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
    });

    return { ...data, accessToken, refreshToken };
}

const logoutUser = async (sessionToken: string) => {
    const result = await auth.api.signOut({
        headers: new Headers({ Authorization: \`Bearer \${sessionToken}\` })
    });
    return result;
}

export const AuthService = { registerUser, loginUser, logoutUser };
`;

export const authRouteTs = `import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post("/logout", AuthController.logoutUser);

export const AuthRoutes = router;
`;

export const authInterfaceTs = `import { z } from "zod";
import { AuthValidation } from "./auth.validation.js";

export type IRegisterUserPayload = z.infer<typeof AuthValidation.registerValidationSchema>;
export type ILoginUserPayload = z.infer<typeof AuthValidation.loginValidationSchema>;
`;

export const authValidationTs = `import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};
`;

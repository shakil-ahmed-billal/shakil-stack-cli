export const httpClientTs = `import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);
`;

export const tokenUtilsTs = `"use server";
import { cookies } from "next/headers";

export async function setTokenInCookies(name: string, token: string, maxAge?: number) {
  const cookieStore = await cookies();
  cookieStore.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: maxAge || 3600, // Default 1 hour
  });
}
`;

export const cookieUtilsTs = `"use server";
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
`;

export const authActionsTs = `"use server";

import { httpClient } from '@/lib/axios/httpClient';
import { setTokenInCookies } from '@/lib/tokenUtils';
import { deleteCookie } from '@/lib/cookieUtils';
import { cookies } from 'next/headers';

export const loginAction = async (payload: any) => {
    try {
        const response: any = await httpClient.post("/auth/login", payload);

        if (response?.success && response?.data) {
            const { accessToken, refreshToken, token } = response.data;
            
            if (accessToken) await setTokenInCookies("accessToken", accessToken);
            if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
            if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }

        return response;
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message || "Login failed"
        };
    }
}

export const registerAction = async (payload: any) => {
    try {
        const response: any = await httpClient.post("/auth/register", payload);

        if (response?.success && response?.data) {
            const { accessToken, refreshToken, token } = response.data;
            
            if (accessToken) await setTokenInCookies("accessToken", accessToken);
            if (refreshToken) await setTokenInCookies("refreshToken", refreshToken);
            if (token) await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
        }

        return response;
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message || "Registration failed"
        };
    }
}

export const logoutAction = async () => {
    try {
        await httpClient.post("/auth/logout", {});
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        await deleteCookie("better-auth.session_token");
        return { success: true };
    } catch (error: any) {
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        await deleteCookie("better-auth.session_token");
        return { success: false, message: "Logged out locally." };
    }
}
`;

export const loginFormTsx = `
"use client"

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginAction } from "@/services/auth.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAction(data);
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="m@example.com" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
`;

export const registerFormTsx = `
"use client"

import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerAction } from "@/services/auth.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerAction(data);
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="John Doe" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="m@example.com" />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
`;

export const authPageTsx = (type: 'login' | 'register') => `
import { ${type === 'login' ? 'LoginForm' : 'RegisterForm'} } from "@/components/auth/${type}-form";

export default function ${type === 'login' ? 'LoginPage' : 'RegisterPage'}() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <${type === 'login' ? 'LoginForm' : 'RegisterForm'} />
      </div>
    </div>
  );
}
`;

export const providersTsx = `
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
`;

export const layoutTsx = `
import { Providers } from "@/components/Providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;

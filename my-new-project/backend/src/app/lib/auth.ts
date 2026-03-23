import { betterAuth } from "better-auth";
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

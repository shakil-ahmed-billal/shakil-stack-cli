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

export const basePrisma = `generator client {
  provider = "prisma-client-js"
  output   = "../../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
`;

export const userPrisma = `model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                    String    @id @default(cuid())
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

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
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


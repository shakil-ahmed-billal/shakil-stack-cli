import "dotenv/config";
import { PrismaClient } from "@prisma/client";
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

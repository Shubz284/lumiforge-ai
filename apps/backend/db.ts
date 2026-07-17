import {
  PrismaClient,
  type Payment,
  type User,
  type CreditTransaction,
} from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});

export type { Payment, User, CreditTransaction };

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "./generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const db = new PrismaClient({
  adapter,
});
export { Prisma };

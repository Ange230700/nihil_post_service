// post/src/infrastructure/prisma.ts
import { PrismaClient } from "nihildbpost/prisma/generated/client/index.js";

declare global {
  var __postPrisma: PrismaClient | undefined;
}

const datasourceUrl = process.env.POST_DATABASE_URL;

export const prisma: PrismaClient =
  globalThis.__postPrisma ??
  new PrismaClient({
    datasources: datasourceUrl ? { db: { url: datasourceUrl } } : undefined,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postPrisma = prisma;
}

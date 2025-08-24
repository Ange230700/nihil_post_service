// post\src\api\tests\test-utils.ts

import { PrismaClient } from "nihildbpost/prisma/generated/client";
export const prisma: PrismaClient = new PrismaClient();

export async function cleanupTestResources() {
  await prisma.$disconnect().catch(() => {});
}

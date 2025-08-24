// post\src\api\tests\test-utils.ts

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function cleanupTestResources() {
  await prisma.$disconnect().catch(() => {});
}

// post\src\api\tests\utils\db.ts
import { prisma } from "@nihil_backend/post/api/db.js";

export const withTx = async (fn: () => Promise<void>) => {
  await prisma.$executeRaw`START TRANSACTION`;
  try {
    await fn();
  } finally {
    await prisma.$executeRaw`ROLLBACK`;
  }
};

// post\src\api\server.ts

import app from "@nihil_backend/post/api/config.js";
import { prisma } from "@nihil_backend/post/infrastructure/prisma.js";

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  console.log(`🚀 Post Service API running on port ${PORT}`);
});

const shutdown = async () => {
  try {
    await prisma.$disconnect();
  } catch (e) {
    console.error("Prisma disconnect failed:", e);
  } finally {
    server.close(() => process.exit(0));
  }
};

["SIGINT", "SIGTERM"].forEach((sig) =>
  process.on(sig, () => {
    void shutdown();
  }),
);

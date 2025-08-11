// post\src\api\server.ts

import app from "@nihil_backend/post/api/config.js";
import { prisma } from "@nihil_backend/post/infrastructure/prisma.js";

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Post Service API running on port ${PORT}`);
});
const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, shutdown));

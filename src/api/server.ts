// post\src\api\server.ts

import app from "@nihil_backend/post/api/config.js";
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Post Service API running on port ${PORT}`);
  });
}

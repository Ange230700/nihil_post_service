// post\src\api\server.ts

import app from "@nihil_backend/post/src/api/index";
const PORT = process.env.PORT || 3002;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Post Service API running on port ${PORT}`);
  });
}

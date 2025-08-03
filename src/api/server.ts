// post\src\api\server.mts

import app from "@nihil_backend/post/api/config";
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Post Service API running on port ${PORT}`);
  });
}

// post\src\api\config.ts

import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import router from "@nihil_backend/post/api/router.js";
import { sendError } from "@nihil_backend/post/api/helpers/sendResponse.js";
import { buildCors } from "@nihil_backend/post/api/security/cors.js";
import { securityMiddleware } from "@nihil_backend/post/api/security/index.js";

const app = express();

app.use(buildCors(), ...securityMiddleware);

app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "512kb" }));

app.use(cookieParser());

app.use("/api", router);

const logErrors = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error("🔴 API ERROR", err);
  sendError(res, err.message || "Internal Server Error", 500, err);
};

app.use(logErrors);

export default app;

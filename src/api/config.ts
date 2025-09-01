// post\src\api\config.ts

import express from "express";
import type { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import crypto from "crypto";

import router from "@nihil_backend/post/api/router.js";
import { sendError } from "@nihil_backend/post/api/helpers/sendResponse.js";
import { buildCors } from "@nihil_backend/post/api/security/cors.js";
import { securityMiddleware } from "@nihil_backend/post/api/security/index.js";
import { ZodError } from "zod";

const app = express();

app.use(buildCors(), ...securityMiddleware);

app.use(express.json({ limit: "512kb" }));
app.use(express.urlencoded({ extended: true, limit: "512kb" }));

app.use(cookieParser());

// Generate a nonce per response and set CSP using it
app.use((_, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  (res.locals as { cspNonce: string }).cspNonce = nonce;

  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'", // Swagger UI uses inline styles
      `script-src 'self' 'nonce-${nonce}'`, // <-- allow only scripts with this nonce
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  );
  next();
});

app.use("/api", router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logErrors: ErrorRequestHandler = (err, _req, res, _next): void => {
  if (err instanceof ZodError) {
    sendError(res, "Validation failed", 400, err.issues);
    return;
  }

  // ✅ Safely derive a string message without using `any` directly
  const message =
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message?: unknown }).message === "string"
      ? (err as { message: string }).message
      : "Internal Server Error";

  console.error("🔴 API ERROR", err);

  // ✅ Don’t pass `any` directly to function params
  const errorObj: unknown = err;
  sendError(res, message, 500, errorObj);
};

// Mount the logErrors middleware globally
app.use(logErrors);

export default app;

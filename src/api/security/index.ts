// user\src\api\security\index.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

export const securityMiddleware = [
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  }),
  hpp(),
  rateLimit({
    windowMs: 60_000,
    limit: 120, // tune per service
    standardHeaders: true,
    legacyHeaders: false,
  }),
];

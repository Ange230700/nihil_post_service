// user\src\api\security\index.ts
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

const isTest = process.env.NODE_ENV === "test";

export const securityMiddleware = [
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
  }),
  // Avoid hpp/rateLimit in tests
  ...(!isTest
    ? [
        hpp(),
        rateLimit({
          windowMs: 60_000,
          limit: 120,
          standardHeaders: true,
          legacyHeaders: false,
        }),
      ]
    : []),
];

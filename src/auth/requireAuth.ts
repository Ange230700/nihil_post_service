// post\src\auth\requireAuth.ts
import type { RequestHandler } from "express";
import { verifyAccess } from "@nihil_backend/post/auth/jwt.js";

type WithAuthSub = { auth?: { sub: string } };

export const requireAuthMaybe: RequestHandler = (req, res, next) => {
  const header = req.header("authorization");
  if (header?.startsWith("Bearer ")) {
    const token = header.slice("Bearer ".length).trim();
    try {
      const claims = verifyAccess(token);
      // assumes you've augmented Express.Request with `auth?: { sub: string; [k: string]: unknown }`
      (req as unknown as WithAuthSub).auth = { sub: claims.sub };
    } catch {
      // ignore invalid token for "maybe" mode
    }
  }
  next();
};

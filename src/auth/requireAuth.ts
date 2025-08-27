// post\src\auth\requireAuth.ts
import type { RequestHandler } from "express";
import { verifyAccess } from "@nihil_backend/post/auth/jwt.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const h = req.header("authorization") ?? "";
  const [, token] = h.split(" ");
  if (!token)
    return res.status(401).json({
      status: "error",
      data: null,
      error: { message: "Unauthorized" },
    });
  try {
    req.auth = verifyAccess(token);
    next();
  } catch {
    res.status(401).json({
      status: "error",
      data: null,
      error: { message: "Unauthorized" },
    });
  }
};

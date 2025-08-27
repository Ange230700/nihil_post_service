// post\src\auth\csrf.ts

import type { RequestHandler } from "express";
import { randomBytes } from "crypto";

const COOKIE = "csrf_token";

function readCookie(
  req: { cookies?: unknown },
  name: string,
): string | undefined {
  const bag = req.cookies;
  if (typeof bag !== "object" || bag === null) return undefined;
  const val = (bag as Record<string, unknown>)[name];
  return typeof val === "string" ? val : undefined;
}

export const issueCsrf: RequestHandler = (_req, res, next) => {
  const token = randomBytes(24).toString("hex");
  res.cookie(COOKIE, token, {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
  res.setHeader("X-CSRF-Token", token);
  next();
};

export const requireCsrf: RequestHandler = (req, res, next) => {
  const cookie = readCookie(req, COOKIE);
  const header = req.header("x-csrf-token");
  if (!cookie || !header || cookie !== header)
    return res.status(403).json({
      status: "error",
      data: null,
      error: { message: "CSRF validation failed" },
    });
  next();
};

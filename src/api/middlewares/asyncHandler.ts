// post\src\api\middlewares\asyncHandler.ts

import type { RequestHandler } from "express";

/**
 * Wraps an async request handler, forwarding errors to Express's error middleware.
 * Preserves the handler's generic types (params/body/query/locals).
 */
export function asyncHandler<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

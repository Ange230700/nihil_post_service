// post\src\api\middlewares\asyncHandler.mts

import type { RequestHandler } from "express";

/**
 * Wraps an async request handler, forwarding errors to Express's error middleware.
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

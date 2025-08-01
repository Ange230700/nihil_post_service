// post\src\api\helpers\sendResponse.ts

import { Response } from "express";

export function sendSuccess(res: Response, data: unknown, status = 200) {
  return res.status(status).json({
    status: "success",
    data,
    error: null,
  });
}

export function sendError(
  res: Response,
  message: string,
  code = 400,
  errorObj?: unknown,
) {
  return res.status(code).json({
    status: "error",
    data: null,
    error: {
      message,
      ...(errorObj ? { details: errorObj } : {}),
    },
  });
}

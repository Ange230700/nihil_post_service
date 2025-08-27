// post\src\api\helpers\sendResponse.ts

import { Response } from "express";

export function sendSuccess(res: Response, data: unknown, status = 200) {
  return res.status(status).json({
    status: "success",
    data,
  });
}

export function sendError(
  res: Response,
  message: string,
  status = 400,
  error?: unknown,
) {
  return res.status(status).json({
    status: "error",
    data: null,
    error: error ?? { message },
  });
}

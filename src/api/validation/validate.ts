// post\src\api\validation\validate.ts
import type { RequestHandler, Request } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (
    schema: ZodSchema,
    pick: (keyof Pick<Request, "body" | "params" | "query">)[] = ["body"],
  ): RequestHandler =>
  (req, _res, next) => {
    try {
      for (const part of pick) (req as Request)[part] = schema.parse(req[part]);
      next();
    } catch (e) {
      next(e);
    }
  };

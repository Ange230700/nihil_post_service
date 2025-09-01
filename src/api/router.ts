// post\src\api\router.ts

import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { asyncHandler } from "@nihil_backend/post/api/middlewares/asyncHandler.js";
import { PostController } from "@nihil_backend/post/api/controllers/PostController.js";
import { requireAuthMaybe } from "@nihil_backend/post/auth/requireAuth.js";
import { validate } from "@nihil_backend/post/api/validation/validate.js";
import {
  postIdParamSchema,
  postCreateSchema,
  postUpdateSchema,
} from "@nihil_backend/post/api/validation/post.schemas.js";
import { listQuerySchema } from "@nihil_backend/post/api/validation/post.query.js";
import type { OpenAPIV3 } from "openapi-types";

// derive __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Run query validation only if a query string is present.
// This preserves legacy behavior for plain GET /api/posts (no '?')
const validatePostsListQueryIfPresent: express.RequestHandler = (
  req,
  res,
  next,
) => {
  if (typeof req.originalUrl === "string" && req.originalUrl.includes("?")) {
    return validate(listQuerySchema, "query")(req, res, next);
  }
  next();
};

function resolveSwaggerPath() {
  const candidates = [
    process.env.SWAGGER_PATH, // explicit override
    path.resolve(__dirname, "../api/swagger.yaml"), // dist/api/swagger.yaml (prod)
    path.resolve(process.cwd(), "dist/api/swagger.yaml"), // fallback prod
    path.resolve(process.cwd(), "src/api/swagger.yaml"), // dev (ts-node / local)
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }
  throw new Error(`swagger.yaml not found. Tried: ${candidates.join(", ")}`);
}

/** Narrow unknown -> OpenAPI v3 doc */
function isOpenAPIDocument(x: unknown): x is OpenAPIV3.Document {
  if (typeof x !== "object" || x === null) return false;
  // minimal structural checks
  const o = x as Record<string, unknown>;
  return (
    typeof o.openapi === "string" &&
    typeof o.info === "object" &&
    o.info !== null
  );
}

function loadSwagger(): OpenAPIV3.Document {
  const file = resolveSwaggerPath();
  // YAMLJS returns `any`; parse to `unknown`, check, then cast.
  const parsed = YAML.load(file) as unknown;
  if (!isOpenAPIDocument(parsed)) {
    throw new Error("Invalid swagger.yaml: expected an OpenAPI v3 document");
  }
  return parsed;
}

/** Convert to a JsonObject expected by swagger-ui-express (and please ESLint) */
function toJsonObject(doc: OpenAPIV3.Document): Record<string, unknown> {
  if (typeof doc !== "object" || doc === null) {
    throw new Error("Swagger document must be an object");
  }
  // If you want to ensure it's plain data (no prototypes), uncomment:
  // return JSON.parse(JSON.stringify(doc)) as Record<string, unknown>;
  return doc as unknown as Record<string, unknown>;
}

type SendBody = string | Buffer | Uint8Array | object | null | undefined;

function getNonce(locals: unknown): string | undefined {
  if (locals && typeof locals === "object" && "cspNonce" in locals) {
    const v = (locals as Record<string, unknown>).cspNonce;
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

function withNonce(handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => {
    const origSend: typeof res.send = res.send.bind(res);

    res.send = ((body?: SendBody) => {
      const nonce = getNonce(res.locals);
      const toSend: SendBody =
        typeof body === "string" && nonce
          ? body.replace(/<script(\s|>)/g, `<script nonce="${nonce}"$1`)
          : body;

      return origSend(toSend);
    }) as typeof res.send;

    return handler(req, res, next);
  };
}

const router = express.Router();
const postController = new PostController();

// Docs
router.use(
  "/docs",
  swaggerUi.serve,
  withNonce(swaggerUi.setup(toJsonObject(loadSwagger()))),
);

// CRUD
router.get(
  "/posts",
  validatePostsListQueryIfPresent,
  asyncHandler(postController.getAll),
);
router.get("/posts/:id", asyncHandler(postController.getById));
router.post(
  "/posts",
  requireAuthMaybe,
  validate(postCreateSchema),
  asyncHandler(postController.create),
);
router.put(
  "/posts/:id",
  requireAuthMaybe,
  validate(postIdParamSchema, "params"),
  validate(postUpdateSchema),
  asyncHandler(postController.update),
);
router.delete(
  "/posts/:id",
  requireAuthMaybe,
  asyncHandler(postController.delete),
);

export default router;

// post\src\api\router.ts

import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import { asyncHandler } from "@nihil_backend/post/api/middlewares/asyncHandler.js";
import { PostController } from "@nihil_backend/post/api/controllers/PostController.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { requireAuth } from "@nihil_backend/post/auth/requireAuth.js";
import { postCreateSchema } from "@nihil_backend/post/api/validation/post.schemas.js";
import { validate } from "@nihil_backend/post/api/validation/validate.js";
import { listQuerySchema } from "@nihil_backend/post/api/validation/post.query.js";

// derive __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const router = express.Router();
const swaggerDocument = YAML.load(resolveSwaggerPath());
const postController = new PostController();

// Docs
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CRUD
router.get(
  "/posts",
  validate(listQuerySchema, ["query"]),
  asyncHandler(postController.getAll),
);
router.get("/posts/:id", asyncHandler(postController.getById));
router.post(
  "/posts",
  requireAuth,
  validate(postCreateSchema),
  asyncHandler(postController.create),
);
router.put("/posts/:id", asyncHandler(postController.update));
router.delete("/posts/:id", asyncHandler(postController.delete));

export default router;

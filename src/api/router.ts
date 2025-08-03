// post\src\api\router.ts

import express from "express";
import { asyncHandler } from "@nihil_backend/post/api/middlewares/asyncHandler";
import { PostController } from "@nihil_backend/post/api/controllers/PostController";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const router = express.Router();
const swaggerDocument = YAML.load(
  path.resolve(process.cwd(), "src/api/swagger.yaml"),
);
const postController = new PostController();

// Docs
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CRUD
router.get("/posts", asyncHandler(postController.getAll));
router.get("/posts/:id", asyncHandler(postController.getById));
router.post("/posts", asyncHandler(postController.create));
router.put("/posts/:id", asyncHandler(postController.update));
router.delete("/posts/:id", asyncHandler(postController.delete));

export default router;

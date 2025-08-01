// post\src\api\controllers\PostController.ts

import { RequestHandler } from "express";
import { PostUseCases } from "@nihil_backend/post/src/application/useCases/PostUseCases";
import { PostRepository } from "@nihil_backend/post/src/infrastructure/repositories/PostRepository";
import {
  sendSuccess,
  sendError,
} from "@nihil_backend/post/src/api/helpers/sendResponse";
import { toPostDTO } from "@nihil_backend/post/src/api/dto/PostDTO";

export class PostController {
  private readonly repo = new PostRepository();
  private readonly useCases = new PostUseCases(this.repo);

  getAll: RequestHandler = async (req, res, next) => {
    try {
      const posts = await this.useCases.getAll();
      sendSuccess(res, posts.map(toPostDTO), 200);
    } catch (e) {
      next(e);
    }
  };

  getById: RequestHandler = async (req, res, next) => {
    try {
      const post = await this.useCases.getById(req.params.id);
      if (!post) return sendError(res, "Not found", 404);
      sendSuccess(res, toPostDTO(post), 200);
    } catch (e) {
      next(e);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    const { userId, content, mediaUrl, originalPostId } = req.body;
    if (!userId || !content)
      return sendError(res, "Missing required fields", 400);
    try {
      const post = await this.useCases.create({
        userId,
        content,
        mediaUrl,
        originalPostId,
      });
      sendSuccess(res, toPostDTO(post), 201);
    } catch (e) {
      next(e);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const updated = await this.useCases.update(req.params.id, req.body);
      if (!updated) return sendError(res, "Not found", 404);
      sendSuccess(res, toPostDTO(updated), 200);
    } catch (e) {
      next(e);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const ok = await this.useCases.delete(req.params.id);
      if (!ok) return sendError(res, "Not found", 404);
      sendSuccess(res, null, 200);
    } catch (e) {
      next(e);
    }
  };
}

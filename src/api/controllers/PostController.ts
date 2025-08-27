// post\src\api\controllers\PostController.ts

import { RequestHandler } from "express";
import type { z } from "zod";
import { PostUseCases } from "@nihil_backend/post/application/useCases/PostUseCases.js";
import {
  sendSuccess,
  sendError,
} from "@nihil_backend/post/api/helpers/sendResponse.js";
import { PostRepository } from "@nihil_backend/post/infrastructure/repositories/PostRepository.js";
import { toPostDTO } from "@nihil_backend/post/api/dto/PostDTO.js";
import {
  postCreateSchema,
  postUpdateSchema,
} from "@nihil_backend/post/api/validation/post.schemas.js";

// Types for params & bodies
type PostIdParams = { id: string };
type PostCreateBody = z.infer<typeof postCreateSchema>;
type PostUpdateBody = z.infer<typeof postUpdateSchema>;

export class PostController {
  private readonly repo = new PostRepository();
  private readonly useCases = new PostUseCases(this.repo);

  getAll: RequestHandler = async (req, res, next) => {
    try {
      // Treat *presence of a real query string* as the signal for paginated mode
      const hadQueryString =
        typeof req.originalUrl === "string" && req.originalUrl.includes("?");

      if (!hadQueryString) {
        // Legacy behavior: return a plain array (tests expect this)
        const posts = await this.useCases.getAll();
        return sendSuccess(res, posts.map(toPostDTO), 200);
      }

      // Paginated behavior when query string is present.
      // `validate(listQuerySchema, "query")` already parsed & sanitized req.query, but we'll read defensively.
      const q = req.query as unknown as {
        limit?: number;
        cursor?: string;
        q?: string;
        userId?: string;
        before?: string;
        after?: string;
      };

      const limit = typeof q.limit === "number" ? q.limit : 20;

      const { items, nextCursor } = await this.useCases.list({
        limit,
        cursor: typeof q.cursor === "string" ? q.cursor : undefined,
        userId: typeof q.userId === "string" ? q.userId : undefined,
        q: typeof q.q === "string" ? q.q : undefined,
        before: typeof q.before === "string" ? new Date(q.before) : undefined,
        after: typeof q.after === "string" ? new Date(q.after) : undefined,
      });

      return sendSuccess(
        res,
        { items: items.map(toPostDTO), nextCursor, limit },
        200,
      );
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

  create: RequestHandler<unknown, unknown, PostCreateBody> = async (
    req,
    res,
    next,
  ) => {
    const { userId, content, mediaUrl, originalPostId } = req.body;
    const uid = req.auth?.sub ?? userId;
    if (!uid || !content) return sendError(res, "Missing required fields", 400);

    try {
      const post = await this.useCases.create({
        userId: uid,
        content,
        mediaUrl,
        originalPostId,
      });
      sendSuccess(res, toPostDTO(post), 201);
    } catch (e) {
      next(e);
    }
  };

  update: RequestHandler<PostIdParams, unknown, PostUpdateBody> = async (
    req,
    res,
    next,
  ) => {
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

// post\src\infrastructure\repositories\PostRepository.ts

import { prisma } from "@nihil_backend/post/infrastructure/prisma.js";
import { IPostRepository } from "@nihil_backend/post/application/interfaces/IPostRepository.js";
import { Post } from "@nihil_backend/post/core/entities/Post.js";

export class PostRepository implements IPostRepository {
  async list(options: {
    limit: number;
    cursor?: string;
    userId?: string;
    q?: string;
    before?: Date;
    after?: Date;
  }): Promise<{ items: Post[]; nextCursor: string | null }> {
    const { limit, cursor, userId, q, before, after } = options;

    const where = {
      isDeleted: false,
      ...(userId ? { userId } : {}),
      ...(q ? { content: { contains: q, mode: "insensitive" } } : {}),
      ...(before || after
        ? {
            createdAt: {
              ...(before ? { lt: before } : {}),
              ...(after ? { gt: after } : {}),
            },
          }
        : {}),
    };

    // Deterministic order; include id for tiebreaker
    const orderBy = [{ createdAt: "desc" as const }, { id: "desc" as const }];

    const rows = await prisma.post.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy,
    });

    const hasMore = rows.length > limit;
    if (hasMore) rows.pop(); // remove lookahead

    return {
      items: rows.map(
        (p) =>
          new Post(
            p.id,
            p.userId,
            p.content,
            p.mediaUrl,
            p.createdAt,
            p.updatedAt,
            p.isDeleted,
            p.originalPostId,
          ),
      ),
      nextCursor: hasMore ? rows[rows.length - 1].id : null,
    };
  }

  async getAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({ where: { isDeleted: false } });
    return posts.map(
      (p) =>
        new Post(
          p.id,
          p.userId,
          p.content,
          p.mediaUrl,
          p.createdAt,
          p.updatedAt,
          p.isDeleted,
          p.originalPostId,
        ),
    );
  }

  async getById(id: string): Promise<Post | null> {
    const p = await prisma.post.findUnique({ where: { id } });
    if (!p || p.isDeleted) return null;
    return new Post(
      p.id,
      p.userId,
      p.content,
      p.mediaUrl,
      p.createdAt,
      p.updatedAt,
      p.isDeleted,
      p.originalPostId,
    );
  }

  async create(data: {
    userId: string;
    content: string;
    mediaUrl?: string | null;
    originalPostId?: string | null;
  }): Promise<Post> {
    const p = await prisma.post.create({
      data: {
        userId: data.userId,
        content: data.content,
        mediaUrl: data.mediaUrl,
        originalPostId: data.originalPostId,
      },
    });
    return new Post(
      p.id,
      p.userId,
      p.content,
      p.mediaUrl,
      p.createdAt,
      p.updatedAt,
      p.isDeleted,
      p.originalPostId,
    );
  }

  async update(
    id: string,
    data: Partial<Omit<Post, "id" | "userId">>,
  ): Promise<Post | null> {
    try {
      const p = await prisma.post.update({ where: { id }, data });
      return new Post(
        p.id,
        p.userId,
        p.content,
        p.mediaUrl,
        p.createdAt,
        p.updatedAt,
        p.isDeleted,
        p.originalPostId,
      );
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.post.update({ where: { id }, data: { isDeleted: true } });
      return true;
    } catch {
      return false;
    }
  }
}

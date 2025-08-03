// post\src\infrastructure\repositories\PostRepository.mts

import { PrismaClient } from "nihildbpost/prisma/generated/client/index.js";
import { IPostRepository } from "@nihil_backend/post/application/interfaces/IPostRepository";
import { Post } from "@nihil_backend/post/core/entities/Post";
const prisma = new PrismaClient();

export class PostRepository implements IPostRepository {
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

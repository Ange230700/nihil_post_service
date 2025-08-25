// post\src\application\interfaces\IPostRepository.ts

import { Post } from "@nihil_backend/post/core/entities/Post.js";

export interface IPostRepository {
  list(options: {
    limit: number;
    cursor?: string;
    userId?: string;
    q?: string;
    before?: Date;
    after?: Date;
  }): Promise<{ items: Post[]; nextCursor: string | null }>;
  getAll(): Promise<Post[]>;
  getById(id: string): Promise<Post | null>;
  create(data: {
    userId: string;
    content: string;
    mediaUrl?: string | null;
    originalPostId?: string | null;
  }): Promise<Post>;
  update(
    id: string,
    data: Partial<Omit<Post, "id" | "userId">>,
  ): Promise<Post | null>;
  delete(id: string): Promise<boolean>;
}

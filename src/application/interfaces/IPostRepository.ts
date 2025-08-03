// post\src\application\interfaces\IPostRepository.mts

import { Post } from "@nihil_backend/post/core/entities/Post";

export interface IPostRepository {
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

// post\src\api\dto\PostDTO.ts

import { Post } from "@nihil_backend/post/src/core/entities/Post";

export interface PostDTO {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  originalPostId?: string | null;
}

export function toPostDTO(entity: Post): PostDTO {
  return {
    id: entity.id,
    userId: entity.userId,
    content: entity.content,
    mediaUrl: entity.mediaUrl ?? null,
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
    originalPostId: entity.originalPostId ?? null,
  };
}

export interface APIResponse<T> {
  status: string;
  data: T;
  error?: unknown;
}

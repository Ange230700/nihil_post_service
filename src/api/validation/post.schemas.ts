// post\src\api\validation\post.schemas.ts
import { z } from "zod";
export const postCreateSchema = z.object({
  // userId will come from auth; allow override only for admin/internal
  content: z.string().min(1).max(4000),
  mediaUrl: z.url().nullable().optional(),
  originalPostId: z.uuid().nullable().optional(),
  userId: z.string().min(1).optional(),
});
export const postUpdateSchema = postCreateSchema.partial();
export const postIdParamSchema = z.object({ id: z.uuid() });

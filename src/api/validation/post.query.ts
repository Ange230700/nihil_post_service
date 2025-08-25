// post\src\api\validation\post.query.ts
import { z } from "zod";

export const listQuerySchema = z.object({
  limit: z
    .preprocess((v) => Number(v ?? 20), z.number().int().min(1).max(100))
    .optional(),
  cursor: z.string().uuid().optional(), // id of last item from previous page
  userId: z.string().uuid().optional(), // filter by author
  q: z.string().min(1).max(200).optional(), // full-text-ish match (content)
  before: z.string().datetime().optional(), // ISO date-time
  after: z.string().datetime().optional(), // ISO date-time
});
export type ListQuery = z.infer<typeof listQuerySchema>;

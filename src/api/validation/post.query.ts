// post\src\api\validation\post.query.ts
import { z } from "zod";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)");

export const listQuerySchema = z.object({
  limit: z
    .preprocess((v) => Number(v ?? 20), z.number().int().min(1).max(100))
    .optional(),
  cursor: z.uuid().optional(), // id of last item from previous page
  userId: z.uuid().optional(), // filter by author
  q: z.string().min(1).max(200).optional(), // full-text-ish match (content)
  before: dateSchema.optional(), // ISO date-time
  after: dateSchema.optional(), // ISO date-time
});
export type ListQuery = z.infer<typeof listQuerySchema>;

// post\src\api\validation\env.ts
import { z } from "zod";
export const Env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  FRONT_API_BASE_URL: z.string().url().optional(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  ACCESS_TOKEN_TTL: z.string().optional(),
  REFRESH_TOKEN_TTL: z.string().optional(),
  USER_DATABASE_URL: z.string().url(),
  POST_DATABASE_URL: z.string().url(),
});
export const env = Env.parse(process.env);

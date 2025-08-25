// user\src\api\security\cors.ts
import cors from "cors";

const normalize = (s?: string | null) => (s ?? "").replace(/\/+$/, ""); // remove trailing slash

export const buildCors = () => {
  const allowed = [process.env.FRONT_API_BASE_URL, process.env.ADMIN_APP_ORIGIN]
    .filter(Boolean)
    .map(normalize);

  return cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const o = normalize(origin);
      cb(null, allowed.includes(o));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    maxAge: 600,
  });
};

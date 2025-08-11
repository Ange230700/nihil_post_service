# post\Dockerfile

# --- Deps + Dev toolchain (use single root lockfile) ---
FROM node:24-alpine3.21 AS deps
WORKDIR /app

# Root lockfile + package manifests for all workspaces so npm can resolve them
COPY package.json package-lock.json ./
COPY user/package.json user/package.json
COPY post/package.json post/package.json

# Install ALL deps (incl. dev) once at root
RUN npm ci

# --- Build target workspace ---
FROM node:24-alpine3.21 AS build
WORKDIR /app
COPY --from=deps /app /app/

# TS configs + sources just for "post"
COPY tsconfig.base.json tsconfig.base.json
COPY post/tsconfig.json post/tsconfig.json
COPY post/src post/src

# Build only the post workspace
RUN npm run --workspace=@nihil_backend/post build

# --- Runtime (prune dev deps) ---
FROM node:24-alpine3.21
WORKDIR /app

# Non-root user
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

# Bring compiled app
COPY --from=build /app/post/dist ./dist

# Bring node_modules and manifests, then prune dev deps
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY post/package.json post/package.json
RUN npm prune --omit=dev

# Swagger (static)
COPY post/src/api/swagger.yaml ./src/api/swagger.yaml

USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.js"]

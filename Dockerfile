# post\Dockerfile

# --- Deps + Dev toolchain (use single root lockfile) ---
FROM node:24-alpine3.21 AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build target workspace ---
FROM node:24-alpine3.21 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json tsconfig.json
COPY src src
COPY scripts scripts
RUN npm run build

# --- Runtime (prune dev deps) ---
FROM node:24-alpine3.21
WORKDIR /app
RUN addgroup -S appgroup && adduser -S -G appgroup appuser
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY src/api/swagger.yaml ./src/api/swagger.yaml
RUN npm prune --omit=dev
USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.js"]

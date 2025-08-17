# post\Dockerfile

# Base stage
FROM node:24-alpine3.21 AS base
WORKDIR /app

# --- Deps (dev deps for build) ---
FROM base AS deps
COPY package*.json ./
RUN npm i

# --- Build (uses dev deps) ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY src src
COPY scripts scripts
RUN npm run build

# --- Prod deps only ---
FROM base AS prod-deps
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# --- Runtime ---
FROM node:24-alpine3.21
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

# App code + known-good package.json + prod deps
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules

# (Optional) normalize package.json to avoid BOM/encoding edge-cases
RUN node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('package.json','utf8'));fs.writeFileSync('package.json',JSON.stringify(j, null, 2));"

# Swagger file path expected by your app
RUN mkdir -p ./src/api
COPY src/api/swagger.yaml ./src/api/swagger.yaml

USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.js"]

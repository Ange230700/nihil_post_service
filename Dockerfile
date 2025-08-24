# post\Dockerfile

# Base stage
FROM node:24-alpine3.21 AS base
WORKDIR /app

# --- Deps (dev deps for build) ---
FROM base AS deps
ENV NPM_CONFIG_CACHE=/tmp/.npm
COPY package*.json ./
RUN set -eux; \
    if [ -f package-lock.json ]; then \
    npm ci --ignore-scripts --no-optional --no-audit --no-fund; \
    else \
    npm install --ignore-scripts --no-optional --no-audit --no-fund; \
    fi

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
ENV NPM_CONFIG_CACHE=/tmp/.npm
COPY package*.json ./
RUN set -eux; \
    if [ -f package-lock.json ]; then \
    npm ci --omit=dev --ignore-scripts --no-optional --no-audit --no-fund; \
    else \
    npm install --omit=dev --ignore-scripts --no-optional --no-audit --no-fund; \
    fi

# --- Runtime ---
FROM node:24-alpine3.21
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

# App code + known-good package.json + prod deps
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules

# Merge consecutive RUNs (curl install + package.json normalize + mkdir)
RUN set -eux; \
    apk add --no-cache curl; \
    node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync('package.json','utf8'));fs.writeFileSync('package.json',JSON.stringify(j, null, 2));"; \
    mkdir -p ./src/api

# Swagger file path expected by your app
COPY src/api/swagger.yaml ./src/api/swagger.yaml

USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.js"]

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

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY scripts ./scripts
RUN npm run build

# --- Prod deps only ---
FROM base AS prod-deps
ENV NPM_CONFIG_CACHE=/tmp/.npm
# ✅ prevent husky from running in containers
ENV HUSKY=0 CI=1 \
  npm_config_fund=false npm_config_audit=false npm_config_update_notifier=false
# ✅ add build tools for native modules (argon2, node-gyp)
RUN apk add --no-cache --virtual .gyp g++ make python3
COPY package*.json ./
RUN set -eux; \
    # Neutralize prepare so "husky" isn't called with dev deps omitted
    npm pkg set scripts.prepare=":" ; \
    # Install prod deps (allows native builds)
    if [ -f package-lock.json ]; then \
        npm ci --omit=dev --no-optional --no-audit --no-fund; \
    else \
        npm install --omit=dev --no-optional --no-audit --no-fund; \
    fi; \
    # Ensure argon2 native build is present; no-op if prebuilt exists
    npm rebuild argon2 || true; \
    # ✅ clean up build deps
    apk del .gyp

# --- Runtime ---
FROM node:24-alpine3.21
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules

RUN set -eux; \
    apk add --no-cache curl libc6-compat

# Put swagger next to compiled server
COPY src/api/swagger.yaml ./dist/api/swagger.yaml

USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.js"]

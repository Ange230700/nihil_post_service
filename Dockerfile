# post\Dockerfile

# --- Build Stage ---
FROM node:24-alpine3.21 AS build
WORKDIR /app

# Copy only package info and configs (best Docker cache for deps)
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY user/package.json ./user/
COPY user/tsconfig.json ./user/tsconfig.json
COPY post/package.json ./post/
COPY post/tsconfig.json ./post/tsconfig.json

# Copy source files so TypeScript build works
COPY user/src ./user/src
COPY post/src ./post/src

# Install all deps and trigger build via postinstall
RUN npm install

# --- Production Stage ---
FROM node:24-alpine3.21
WORKDIR /app

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S -G appgroup appuser

# Only copy production code and deps
COPY --from=build /app/post/dist ./dist
COPY --from=build /app/post/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/post/src/api/swagger.yaml ./src/api/swagger.yaml

USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.mjs"]

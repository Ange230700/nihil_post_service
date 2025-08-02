# post\Dockerfile

# --- Build Stage ---
FROM node:24-alpine3.21 AS build
WORKDIR /app
RUN apk update && apk upgrade --no-cache
COPY . .
RUN npm i
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine3.21
WORKDIR /app
RUN addgroup -S appgroup && \
    adduser -S -G appgroup appuser
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/api/server.js"]

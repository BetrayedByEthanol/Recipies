FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy shared types and server source
COPY ../shared ./shared
COPY . .

RUN npm run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output and shared types (needed at runtime via paths)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

# Seeds are mounted or baked in
COPY ../seeds ./seeds

# Data directory will be a Docker volume
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/recipes.db
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/index.js"]

# Build context: repository root
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY shared/ ./shared/
COPY server/ ./server/
COPY seeds/ ./seeds/

RUN pnpm --filter @recipes/shared run build
RUN pnpm --filter recipes-server run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared/dist ./shared/dist
COPY seeds/ ./seeds/

RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/recipes.db
ENV PORT=3001

EXPOSE 3001

CMD ["node", "server/dist/index.js"]

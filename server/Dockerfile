# Build context: repository root
FROM node:20-slim AS base
WORKDIR /app
RUN npm install -g pnpm@9 --quiet

# ── deps: install with native build tools ────────────────────────────────────
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

# Run scripts so better-sqlite3 compiles its native binding
RUN pnpm install --frozen-lockfile

# ── build ─────────────────────────────────────────────────────────────────────
FROM deps AS build
COPY shared/ ./shared/
COPY server/ ./server/
COPY seeds/ ./seeds/

RUN pnpm --filter @recipes/shared run build
RUN pnpm --filter recipes-server run build

# ── runtime ───────────────────────────────────────────────────────────────────
FROM base AS runtime

ENV NODE_ENV=production
ENV DB_PATH=/data/recipes.db
ENV PORT=3001

# Copy node_modules from deps (includes compiled better-sqlite3 binding)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/shared/node_modules ./shared/node_modules

# Copy built output and runtime files
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/seeds ./seeds
COPY --from=build /app/server/package.json ./server/package.json
COPY --from=build /app/shared/package.json ./shared/package.json
COPY package.json pnpm-workspace.yaml ./

RUN mkdir -p /data && chown node:node /data

USER node

EXPOSE 3001
CMD ["node", "server/dist/index.js"]

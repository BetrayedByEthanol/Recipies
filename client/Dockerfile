# Build context: repository root
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9 --quiet

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY client/package.json ./client/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY shared/ ./shared/
COPY client/ ./client/

RUN pnpm --filter @recipes/shared run build
RUN pnpm --filter recipes-client run build

# ── Runtime: nginx ────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
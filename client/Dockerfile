# Build context: repository root
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json ./shared/
COPY client/package.json ./client/

RUN pnpm install --frozen-lockfile

COPY shared/ ./shared/
COPY client/ ./client/

# Build shared first so @shared alias resolves during vite build
RUN pnpm exec tsc -p shared/tsconfig.json
WORKDIR /app/client
RUN pnpm run build

# ── Runtime: nginx ────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS runtime

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Recipes App

A self-hosted recipe management PWA. React + TypeScript frontend, Express + SQLite backend.

The PWA shell and API responses are cached by the service worker, so previously-loaded recipes are available when offline. New recipes require a network connection.

---

## Quick start (Docker)

```bash
git clone https://github.com/BetrayedByEthanol/Recipies
cd Recipies
docker compose up --build -d
```

App is available at **http://localhost**.

---

## Development

### Prerequisites

- Node 20+
- pnpm 9+ (`npm install -g pnpm@9`)

### Install

```bash
pnpm install
```

### Run locally

```bash
# Terminal 1 — backend (hot reload)
pnpm dev:server

# Terminal 2 — frontend (Vite HMR)
pnpm dev:client
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001  
Vite proxies `/api/*` to the backend automatically.

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

---

## Write protection (optional)

By default all routes are open, suitable for local or trusted-network use.

To protect write routes (`POST`/`PUT`/`DELETE`) in production, set `ADMIN_TOKEN` in your environment or `docker-compose.yml`:

```yaml
environment:
  ADMIN_TOKEN: your-secret-token
```

Write requests must then include:

```
Authorization: Bearer your-secret-token
```

Read routes (`GET`) are always public.

---

## Adding predefined recipes

Edit `seeds/recipes.json`. Seeds run only on first startup (empty database).

To reseed:

```bash
docker compose down -v   # removes the data volume
docker compose up --build -d
```

---

## Data backup

```bash
docker compose exec server sqlite3 /data/recipes.db ".backup /data/backup.db"
docker compose cp server:/data/backup.db ./backup.db
```

---

## API

| Method | Path               | Auth required      | Description       |
|--------|--------------------|--------------------|-------------------|
| GET    | `/api/recipes`     | No                 | List all recipes  |
| GET    | `/api/recipes/:id` | No                 | Get single recipe |
| POST   | `/api/recipes`     | If ADMIN_TOKEN set | Create recipe     |
| PUT    | `/api/recipes/:id` | If ADMIN_TOKEN set | Update recipe     |
| DELETE | `/api/recipes/:id` | If ADMIN_TOKEN set | Delete recipe     |
| GET    | `/health`          | No                 | Health check      |

---

## Project structure

```
recipes-app/
├── client/               # React + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── api/          # Typed fetch wrappers
│   │   ├── components/   # RecipeCard, RecipeDetail, RecipeForm
│   │   ├── hooks/        # useRecipes
│   │   └── App.tsx
│   └── Dockerfile
├── server/               # Express + TypeScript + better-sqlite3
│   ├── src/
│   │   ├── __tests__/    # Vitest + Supertest smoke tests
│   │   ├── db/           # Schema, seed, queries
│   │   ├── middleware/   # auth (ADMIN_TOKEN)
│   │   └── routes/       # /api/recipes, validation
│   └── Dockerfile
├── shared/               # Shared TypeScript types + CATEGORIES constant
├── seeds/
│   └── recipes.json      # Predefined recipes
├── docker-compose.yml
├── package.json          # Root workspace scripts
└── pnpm-workspace.yaml
```

# Recipes App

A self-hosted recipe management PWA. React + TypeScript frontend, Express + SQLite backend. Runs fully offline via PWA caching.

## Quick start

```bash
docker compose up --build
```

App is available at **http://localhost**.

---

## Development

### Prerequisites
- Node 20+
- npm

### Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Run locally

```bash
# Terminal 1 — backend (hot reload)
cd server && npm run dev

# Terminal 2 — frontend (Vite HMR)
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3001  
The Vite dev server proxies `/api/*` → backend automatically.

---

## Adding predefined recipes

Edit `seeds/recipes.json` and add entries following the existing schema:

```json
{
  "title": "Rezeptname",
  "category": "Vegetarisch",
  "emoji": "🥗",
  "duration_minutes": 30,
  "servings": 4,
  "image_url": null,
  "ingredients": [
    { "amount": "200", "unit": "g", "name": "Zutat" }
  ],
  "steps": [
    "Erster Schritt.",
    "Zweiter Schritt."
  ]
}
```

Seeds only run on **first startup** when the database is empty. To reseed:

```bash
docker compose down -v   # removes the data volume
docker compose up --build
```

---

## Data persistence

Recipe data is stored in a SQLite database on a named Docker volume (`recipes-data`). It survives container restarts and rebuilds.

To back up:

```bash
docker compose exec server sqlite3 /data/recipes.db ".backup /data/recipes.backup.db"
docker compose cp server:/data/recipes.backup.db ./backup.db
```

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/recipes` | List all recipes |
| GET | `/api/recipes/:id` | Get single recipe |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/:id` | Update recipe |
| DELETE | `/api/recipes/:id` | Delete recipe |
| GET | `/health` | Health check |

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
│   ├── Dockerfile
│   └── vite.config.ts
├── server/               # Express + TypeScript + better-sqlite3
│   ├── src/
│   │   ├── db/           # Schema, seed, queries
│   │   └── routes/       # /api/recipes, validation
│   └── Dockerfile
├── shared/
│   └── types.ts          # Types shared between client and server
├── seeds/
│   └── recipes.json      # Predefined recipes (plain JSON)
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## CI

GitHub Actions runs on every push and PR to `main`:

- Server: typecheck + lint
- Client: typecheck + lint + build
- Docker: `docker compose build`

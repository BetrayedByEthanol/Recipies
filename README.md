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

App is available at **http://localhost:8080**.

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

---

## Home HTTPS / PWA install

PWA installation requires a secure context:

`docker-compose.https.yml` is optional and keeps TLS in a separate reverse-proxy container. The app containers stay HTTP-only internally.

### Home HTTPS with nginx

DNS must be configured separately:

#### A. DNS requirement

- `recipes.home.arpa -> <server LAN IP>`

#### B. Generate local cert with SAN using mkcert

```bash
mkdir -p deploy/certs

mkcert   -cert-file deploy/certs/recipes.home.arpa.crt   -key-file deploy/certs/recipes.home.arpa.key   recipes.home.arpa
```

Or include a LAN IP SAN too:

```bash
mkcert   -cert-file deploy/certs/recipes.home.arpa.crt   -key-file deploy/certs/recipes.home.arpa.key   recipes.home.arpa 192.168.1.50
```

#### C. Verify SAN

```bash
openssl x509 -in deploy/certs/recipes.home.arpa.crt -noout -text | grep -A2 "Subject Alternative Name"
```

Expected output includes:

```text
DNS:recipes.home.arpa
```

#### D. Start HTTPS stack

```bash
cp .env.example .env
# edit APP_DOMAIN, APP_ORIGIN, TLS_CERT_NAME if needed

docker compose -f docker-compose.yml -f docker-compose.https.yml --env-file .env up -d --build
```

#### E. Test

```bash
curl -kI https://recipes.home.arpa/
curl -k https://recipes.home.arpa/manifest.webmanifest
curl -k https://recipes.home.arpa/sw.js
```

#### F. Client trust

- `curl -k` bypasses trust and only proves the server is serving HTTPS.
- PWA install requires the browser to trust the cert without warnings.
- Install/trust the mkcert root CA on each device.
- On Linux:

```bash
sudo cp "$(mkcert -CAROOT)/rootCA.pem" /usr/local/share/ca-certificates/mkcert-rootCA.crt
sudo update-ca-certificates
```

- Restart Chrome after trusting the CA.

#### G. 

If browser shows a certificate error, check:

```bash
curl -Iv https://recipes.home.arpa/
```

- If error says self-signed/unknown issuer: client trust problem.
- If TLS handshake fails: check nginx logs.

Check nginx logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml --env-file .env logs proxy
curl -kI https://recipes.home.arpa/
docker cp "$(docker compose -f docker-compose.yml -f docker-compose.https.yml --env-file .env ps -q proxy)":/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
```

Validate rendered nginx config:

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml --env-file .env exec proxy nginx -T


```

### Browser verification checklist

1. Clear old site data.
2. Unregister old service worker.
3. Reload twice.
4. Open DevTools → Application → Manifest.
5. Confirm installability (browser offers **Install**, not just "Create shortcut").


# FreeBrain — Local Docker Dev Environment

Run the full app locally with hot-reload using Docker. No Node.js install needed on your machine — Docker handles everything.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Quick start

```bash
# 1. Create your .env file (one-time)
cp .env .env.local   # or create .env manually — see below

# 2. Start the dev server (hot-reload at http://localhost:8080)
docker compose up

# 3. Stop
docker compose down
```

Open **http://localhost:8080** — edits to your source files hot-reload instantly.

## Environment variables

Create a `.env` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in **Supabase Dashboard → Settings → API**. Use the same values as your deployed app.

## Commands

| Command | What it does |
|---------|-------------|
| `docker compose up` | Start dev server with hot-reload |
| `docker compose up --build` | Rebuild after changing dependencies |
| `docker compose down` | Stop and remove containers |
| `docker compose up prod` | Build & serve production preview on :3000 |

## How it works

- **Dev container** (`dev` service): runs `npm run dev` with your source mounted as a volume. Edits on your host machine reflect instantly in the browser.
- **`node_modules`** lives only inside the container (anonymous volume) — your host stays clean.
- **Prod preview** (`prod` profile): builds the app and serves the static `dist/` via nginx on port 3000. Use this to test the production build locally.

## Using with free AI coding tools

Once this is running, point any AI coding tool (Cursor, Windsurf, Continue, etc.) at your local repo folder. The tool edits files on disk; Docker picks up the changes and hot-reloads. The dev server stays running — you don't need to restart it between edits.

## Troubleshooting

- **Port 8080 in use?** Change the port in `docker-compose.yml`: `"8081:8080"`.
- **Changes not reflecting?** Run `docker compose up --build` to reinstall deps.
- **Blank page / auth errors?** Double-check your `.env` Supabase values and that your Supabase project allows `http://localhost:8080` as a redirect URL (Auth → URL Config).

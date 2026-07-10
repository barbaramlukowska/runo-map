# MushroomMap 🍄

> Work in progress — Stage 1 (Express API with in-memory data) complete, next up: **Stage 2 — PostgreSQL + Prisma**. This README grows with the project.

A community map of mushroom sightings in Poland. Users anonymously report finds (species, date, approximate location) and browse what others have found nearby — a *give-to-get* model for mushroom pickers.

Portfolio project focused on learning **Node.js (Express)** and **monorepo architecture (Turborepo)**.

## Tech stack

| Area | Choice |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js + react-leaflet *(planned)* |
| Backend | Express 5 (+ Prisma *planned*) |
| Database | PostgreSQL on Supabase *(planned)* |
| Shared validation | Zod schemas in `packages/shared` |
| Testing | Vitest + supertest |
| AI assistant | Gemini via Vercel AI SDK *(planned)* |

## Repository structure

```
mushroom-map/
├── turbo.json              # Turborepo task pipeline
├── pnpm-workspace.yaml
├── apps/
│   ├── web/                # Next.js frontend (placeholder for now)
│   └── api/                # Express API (placeholder for now)
└── packages/
    ├── shared/             # shared TS types + Zod schemas
    └── config/             # shared tsconfig
```

Why a monorepo? One Zod schema in `packages/shared` validates the form on the frontend **and** the request on the backend — single definition, two consumers.

## Getting started

```bash
pnpm install
pnpm typecheck   # runs across all packages via Turborepo
pnpm build
pnpm --filter @mushroom-map/api dev   # API on http://localhost:3001
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/sightings` | list sightings; optional `species`, `from`, `to` filters |
| GET | `/api/sightings/:id` | single sighting |
| POST | `/api/sightings` | report a sighting (Zod-validated, rate-limited 10/h/IP) |
| GET | `/api/health` | healthcheck |

Data lives in memory for now — the store is a factory behind an interface, swapped for Prisma in Stage 2.

## Roadmap

- [x] **Stage 0** — Turborepo + pnpm scaffold, shared package wired into both apps
- [x] **Stage 1** — Express API with in-memory data, tests from day one
- [ ] **Stage 2** — PostgreSQL (Supabase) + Prisma migrations
- [ ] **Stage 3** — Map UI: react-leaflet, clustering, filters, freshness fading
- [ ] **Stage 3.5** — Deploy (Vercel + Render) and CI (GitHub Actions)
- [ ] **Stage 4** — AI assistant with tool calling (sightings + weather)

## Security

Security is designed in from the start, mapped against **OWASP Top 10:2025** (web) and the **LLM/Agentic OWASP lists** for the AI stage. Already implemented:

- Coordinates rounded to ~500 m on write — location privacy by design (A06)
- Every client input (body and query) validated with Zod; invalid input → 400 with issues (A05)
- Central error handler: real errors logged server-side, clients only ever see a generic 500 — no stack traces or internals leak (A10)
- `helmet` security headers, `X-Powered-By` removed (A02)
- Rate limiting: 10 new sightings per IP per hour (A06, anti-vandalism)

Planned: strict CORS at deploy, structured logging with `pino` (A09), supply-chain checks in CI (A03).

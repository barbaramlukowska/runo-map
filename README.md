# MushroomMap 🍄

> Work in progress — currently at **Stage 0: monorepo foundations**. This README grows with the project.

A community map of mushroom sightings in Poland. Users anonymously report finds (species, date, approximate location) and browse what others have found nearby — a *give-to-get* model for mushroom pickers.

Portfolio project focused on learning **Node.js (Express)** and **monorepo architecture (Turborepo)**.

## Tech stack

| Area | Choice |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js + react-leaflet *(planned)* |
| Backend | Express + Prisma *(planned)* |
| Database | PostgreSQL on Supabase *(planned)* |
| Shared validation | Zod schemas in `packages/shared` |
| Testing | Vitest + supertest *(planned)* |
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
```

## Roadmap

- [x] **Stage 0** — Turborepo + pnpm scaffold, shared package wired into both apps
- [ ] **Stage 1** — Express API with in-memory data, tests from day one
- [ ] **Stage 2** — PostgreSQL (Supabase) + Prisma migrations
- [ ] **Stage 3** — Map UI: react-leaflet, clustering, filters, freshness fading
- [ ] **Stage 3.5** — Deploy (Vercel + Render) and CI (GitHub Actions)
- [ ] **Stage 4** — AI assistant with tool calling (sightings + weather)

## Security

Security is designed in from the start, mapped against **OWASP Top 10:2025** (web) and the **LLM/Agentic OWASP lists** for the AI stage. Highlights planned for the MVP:

- Coordinates rounded to ~500 m on write — location privacy by design
- Input validation with Zod on every endpoint, rate limiting per IP
- `helmet`, strict CORS, secrets only in environment variables

*(This section will expand with a full threat-model mapping as stages land.)*

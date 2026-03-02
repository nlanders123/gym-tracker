# Apex

Apex is a minimalist fitness + nutrition tracker designed for **fast logging** and **progressive overload**.

This repo is intentionally documented so that any AI coding agent (OpenClaw, Claude Code, Codex, etc.) can quickly understand:
- what the product is
- the MVP/V1 scope
- the architecture and data model
- what has already been tried

## Product Principles

- **Frictionless > feature-rich**: quick-add macros, minimal taps.
- **Reliable**: data should never “disappear”; changes are small and testable.
- **Consistent UI**: reusable components, no ad-hoc styling.
- **AI-ready**: expose data/actions via MCP so agents can read + write in a controlled way.

See: `DESIGN.md`.

## Tech Stack

- Frontend: React + Vite + Tailwind
- Backend: Supabase (Postgres + Auth + RLS)
- Deployment: Vercel (web/PWA)
- AI Integration (local): MCP server in `mcp_apex/`

## Local Development

### 1) Clone

```bash
git clone https://github.com/nlanders123/gym-tracker.git
cd gym-tracker
```

### 2) Create `.env`

Create a `.env` file in the repo root (NOT committed):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 3) Install + run

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

## Supabase Setup

### Base schema
Run `supabase_schema.sql` once (SQL Editor).

### Migrations
Run migrations as they appear in `supabase_migration_*.sql`.

Current required workout migration:
- `supabase_migration_001_workouts.sql`

## Repo Structure (high level)

- `src/lib/supabase.js` — Supabase client
- `src/contexts/AuthContext.jsx` — auth state
- `src/pages/Nutrition.jsx` — nutrition UI + logic
- `src/pages/Workouts.jsx` — workouts UI + routing to template/session
- `src/pages/workouts/TemplateEditor.jsx` — template builder
- `src/pages/workouts/SessionLogger.jsx` — session + set logging
- `mcp_apex/` — local MCP server scaffold (AI door)

## Operational Rules (how we build)

- Commit small, working increments.
- Don’t refactor wide areas without a reason.
- If a feature requires a schema change, add a `supabase_migration_###.sql`.
- Keep documentation updated (README + CHANGELOG + DESIGN).

## Status

See `CHANGELOG.md` and `ROADMAP.md`.

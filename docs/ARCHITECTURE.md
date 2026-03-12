# Apex — Architecture

## Frontend

- React 19 + Vite 7
- Tailwind CSS 4 via `@tailwindcss/vite`
- React Router v7 (client-side SPA routing)
- Deployed as PWA on Vercel

### Data Layer (`src/lib/api/`)

All Supabase database operations go through the API layer. Components never call `supabase.from()` directly (except AuthContext for auth operations).

| Module | Responsibility |
|--------|---------------|
| `profile.js` | Get/update user profile and macro targets |
| `nutrition.js` | Daily logs, meal CRUD, copy yesterday, totals calculation |
| `workouts.js` | Templates, sessions, exercises, sets, progressive overload queries |

This separation means:
- Frontend can be redesigned without touching data logic
- Business logic is testable independently
- Queries are reusable across components
- Backend can be swapped by changing one layer

### Key modules

- `src/lib/supabase.js` — Supabase client (browser) using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- `src/contexts/AuthContext.jsx` — Reads session on load, subscribes to auth changes

### Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Dashboard.jsx` | Home screen (placeholder) |
| `/login` | `Login.jsx` | Email/password auth |
| `/nutrition` | `Nutrition.jsx` | Macro tracking + meal logging |
| `/workouts` | `Workouts.jsx` | Template list + session history |
| `/template/:id` | `TemplateEditor.jsx` | Edit template exercises |
| `/session/:id` | `SessionLogger.jsx` | Log sets with progressive overload |

## Supabase

### Auth
- Supabase Auth handles passwords + sessions
- `profiles` table auto-created via trigger on sign-up

### Data model

```
profiles
├── daily_logs (one per user/day)
│   └── logged_meals
├── workout_templates
│   └── template_exercises
└── workout_sessions
    └── logged_exercises
        └── logged_sets
```

### Migrations
Managed via Supabase CLI. Files in `supabase/migrations/`.

### Security
Row Level Security (RLS) is enabled on every table.
All policies scope reads/writes to `auth.uid()`.

## Progressive Overload

The key workout feature. When logging a session, for each exercise:
1. Query `logged_exercises` for the most recent session containing that exercise name
2. Fetch the `logged_sets` from that exercise
3. Display "Last time: 80kg x 8" inline during the current session

Implementation: `getLastPerformanceBatch()` in `src/lib/api/workouts.js`

## AI Integration: MCP Server

Folder: `mcp_apex/`

Exposes controlled read/write tools over Apex data to AI agents (Claude Desktop, Delta/OpenClaw, Claude Code).

### Security model
- Runs locally only
- Uses Supabase **service_role** key (server-side secret)
- Never ship the service_role key to the web frontend

### Tools
| Tool | Purpose |
|------|---------|
| `apex_get_profile` | Read user profile + targets |
| `apex_get_today_summary` | Daily nutrition totals |
| `apex_log_meal` | Add meal to daily log |
| `apex_top_foods` | Most-logged meals (30 days) |

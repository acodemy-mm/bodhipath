# ဗောဓိလမ်း · Bodhi Path (MVP)

Responsive gamified Dhamma learning web app — Vipassana modules, meditation timer, smart beads, merit-driven Bodhi Tree, streaks, badges, and a sample MCQ exam.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase-ready (Auth, Postgres, RLS) — migration in `supabase/migrations/001_init.sql`
- Local **demo mode** (browser `localStorage`) when Supabase env vars are not set

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up with any email/password to explore the MVP.

## Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` → `.env.local` and fill in URL + anon key
3. Run `supabase/migrations/001_init.sql` in the SQL editor
4. Restart `npm run dev` — middleware will use Supabase sessions

> Demo mode still powers the UI gamification store until you wire page mutations to Supabase tables. Schema and RLS are ready for that Phase 1.5 connection.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/auth` | Sign in / sign up |
| `/onboarding` | Goal selection |
| `/home` | Bodhi Tree, streak, daily tasks, quote |
| `/learn` | Progressive modules |
| `/practice` | Meditate + beads |
| `/exam` | Sample MCQ |
| `/profile` | Badges & history |

## Merit rules (MVP)

- Lesson complete: +10
- Meditation ≥ 5 min: +15
- Beads ≥ 108: +5
- Quiz with score &gt; 0: +8
- Tree stages at 0 / 50 / 150 / 400 / 1000 merit

# FitPulse

Personal fitness tracker PWA — daily diet plans, workout logging, AI meal photo calorie estimation, progress tracking, and admin panel.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · shadcn-style UI · Zustand · Supabase · Gemini · Recharts

## What's built (Phase 1–3 UI)

- Design system (dark-first, glassmorphism, tokens matching PRD §12)
- Landing page with animated hero + feature grid
- Auth flow: login, signup, 6-digit OTP verification (auto-focus, paste), forgot password
- 4-step onboarding wizard with BMI + calorie/macro calculator + animated reveal
- Dashboard: animated calorie ring, macro bars, water tracker, step/weight, streak flame, today's meals & workout cards, camera FAB
- Diet plan viewer: weekly tabs, inline meal edit, day-total auto-recalc, thyroid warning badges
- Exercise plan viewer: category grouping, expandable sets, progressive overload arrows, rest timer, mark-done animation
- Log meal (photo): camera/gallery upload, mock AI analysis card, editable macros per item, meal-slot picker
- Progress: Recharts weight + calorie charts, adherence tiles, tab shell for photos/measurements
- Settings: profile card, edit-plan entry, plan import screen, sign out
- Admin dashboard: user list with search + summary tiles (mock data)
- API stubs: `/api/analyze-meal`, `/api/parse-plan` (Gemini via `src/lib/ai/provider.ts`)
- Supabase SQL migrations: `supabase/migrations/001_create_tables.sql` (all PRD tables) + `002_rls_policies.sql` (RLS)
- PWA manifest wired

## Run locally

```bash
# 1. Install (npm cache workaround for this Mac)
npm_config_cache=/tmp/npm-cache-claude npm install

# 2. Configure environment (Supabase + Gemini)
cp .env.example .env.local
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...
#   GEMINI_API_KEY=...

# 3. Dev server
npm run dev        # http://localhost:3000

# 4. Production build
npm run build && npm run start
```

The UI works today with mock/local data (Zustand + localStorage) so you can click through everything without Supabase configured.

## Wire real Supabase + Gemini

1. Create a Supabase project. In the SQL editor, run `supabase/migrations/001_create_tables.sql` then `002_rls_policies.sql`.
2. Enable Email/Password + OTP under Authentication → Providers. Set session expiry to 2,592,000 sec (30 days) per NFR-16.
3. Create storage buckets: `meal-photos` and `progress-photos` (private).
4. In `.env.local`, fill in the four keys above.
5. Replace the mock flows in `src/app/(auth)/*` and `src/lib/store/user-store.ts` with real Supabase calls (`createSupabaseBrowser()` from `src/lib/supabase/client.ts`).

## Next phases

- Middleware for `/dashboard`, `/admin` auth guards (server-side)
- DOCX/PDF extraction (`mammoth`, `pdfjs-dist`) → wire `/api/parse-plan`
- Progress photos storage + before/after slider
- Service worker + offline queue for meal logs
- Full admin panel: user detail + plan editors + audit log viewer

## Project layout (per PRD §14)

```
src/
  app/
    (auth)/…            login / signup / verify-otp / forgot-password
    (main)/…            dashboard / plan / log / progress / settings
    admin/…             admin dashboard
    onboarding/         4-step wizard
    api/…               analyze-meal, parse-plan
  components/
    dashboard/          CalorieRing, MacroBars, WaterTracker, StreakBadge
    layout/             Sidebar, BottomNav, PageShell, Logo
    ui/                 Button, Input, Card, Badge, Tabs, Counter, ProgressBar, Label
  lib/
    ai/                 provider.ts (Gemini abstraction)
    prompts/            analyze-meal.ts, parse-plan.ts
    supabase/           client.ts, server.ts
    store/              user-store.ts (Zustand + persist)
    utils/              bmi, calories, format, cn
    types/              index.ts
    constants/          seed-plan.ts
supabase/migrations/    001_create_tables.sql, 002_rls_policies.sql
public/                 manifest.json, assets/…
```

— Enjoy. Snap the meal. Log the set. Watch the ring fill.

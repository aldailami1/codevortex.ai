<div align="center">

# ⚡ CloudForge

**AI-Native Cloud Building & Automation Engine**

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Supabase (PostgreSQL + RLS + Realtime + Edge Functions) · Vercel / Netlify · GitHub Actions

</div>

---

## ✨ Overview

CloudForge is an all-in-one AI cloud workstation:

- 🤖 **Generate** full-stack apps from a single prompt (OpenAI / Anthropic / Gemini, with an offline deterministic fallback so it *never* fails)
- 👁️ **Preview** live in the browser (port 3000, hot-reload, interactive terminal)
- 🧱 **Design** Supabase schemas with RLS in the Schema Builder
- 🚀 **Deploy** with one click to Vercel / Netlify (live build logs)
- 🛒 **Marketplace** of ready-made templates, imported in one click
- 🎓 **Academy** with courses, quizzes and verified certificates
- 🌍 **14 languages** — all copy hardcoded and bundled at build time (no external translation files, no empty keys)

## 🗂 Project Structure

```
.
├── src/
│   ├── app/                 # Next.js App Router (layout, page, api/*, robots, sitemap)
│   ├── components/          # Self-contained UI components (App shell, Landing, Workspace…)
│   ├── lib/
│   │   ├── translations.ts  # ★ ALL UI copy, 14 languages, hardcoded static objects
│   │   ├── i18n.ts          # Language metadata + makeT resolver
│   │   ├── formatter.ts     # Dependency-free code formatter
│   │   ├── supabase.ts      # SSR-safe Supabase clients (graceful env fallback)
│   │   └── utils.ts         # SSR-safe storage + legacy cache migration
│   ├── types/               # Shared domain types (index.ts, academy.ts)
│   └── data/                # Marketplace templates + Academy courses (embedded)
├── supabase/
│   ├── migrations/          # 0001–0004: enums, tables, RBAC+RLS, indexes/realtime
│   └── functions/           # ai-completion, stripe-webhook, crypto-webhook, webhook-dispatcher
├── .github/workflows/       # ci.yml · deploy-vercel.yml · deploy-netlify.yml
├── docs/ENGINEERING_PLAN.md # Full bilingual engineering blueprint (5 axes)
└── tests/                   # Vitest + Testing Library
```

## 🚀 Getting Started

**Prerequisites:** Node.js ≥ 20

```bash
npm install
cp .env.example .env.local   # optional — the app runs with zero env vars
npm run dev                  # http://localhost:3000
```

### Verification commands

```bash
npm run typecheck   # TypeScript, zero errors
npm test            # Vitest suite
npm run build       # production build (same as Vercel)
```

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo — the framework is auto-detected (Next.js).
3. Build command: `npm run build` — Output: `Next.js` (no changes needed).
4. Optional env vars (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SENTRY_DSN`…
5. **First deploy after the rename from CodeVortex:** Vercel → Project → Settings → Builds → **Clear Build Cache** → Redeploy. The app also migrates legacy `codevortex_*` localStorage keys automatically.

### Deploy to Netlify

Netlify auto-detects Next.js via `@netlify/plugin-nextjs` (install once from the Netlify UI, or via `netlify.toml`). Same env variables apply.

## 🔐 Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → run `supabase/migrations/0001…0004` in order (or `supabase db push` with the CLI).
3. Deploy Edge Functions (`supabase/functions/README.md`).
4. Set the env vars + function secrets.

## 🧪 CI/CD

- `ci.yml` runs typecheck + tests + build on every push/PR.
- `deploy-vercel.yml` / `deploy-netlify.yml` deploy production on push to `main`.
- Secrets live in **GitHub Secrets** — never commit real keys.

## 📄 Documentation

- [Engineering Blueprint (الخطة الهندسية)](docs/ENGINEERING_PLAN.md) — architecture, DB schema, RBAC, CI/CD, UI/UX, AI, payments, automation, security, scaling.

## 📄 License

Private / proprietary. © 2026 CloudForge.

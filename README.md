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
- **Control Center** for guarded cyber-shield readiness, visual backend operations, campaign drafts, and approval-aware deployment flows
- 🌍 **14 languages** — all copy hardcoded and bundled at build time (no external translation files, no empty keys)

## 🗂 Project Structure

```
.
├── src/
│   ├── app/                 # Next.js App Router (layout, page, api/*, robots, sitemap)
│   ├── components/          # Self-contained UI components (App shell, Control Center, Landing, Workspace…)
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
5. **First deploy after the brand migration:** Vercel → Project → Settings → Builds → **Clear Build Cache** → Redeploy. The app also migrates legacy `codevortex_*` localStorage keys automatically.

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

## 🛡️ CloudForge safety boundary

The Control Center is intentionally honest about integration state. It can prepare security policies, schema operations, campaign drafts, and approval-aware deployment flows, but it does not claim to replace a production WAF/CDN, silently patch external systems, publish advertising campaigns without approval, or enable hidden revenue sharing. Production activation requires provider credentials stored outside the repository, signed webhooks, RLS policies, rate limits, audit logs, and explicit account configuration.

## 📄 Documentation

- [Engineering Blueprint (الخطة الهندسية)](docs/ENGINEERING_PLAN.md) — architecture, DB schema, RBAC, CI/CD, UI/UX, AI, payments, automation, security, scaling.

## 📄 License

Private / proprietary. © 2026 CloudForge.


## ⚡ Global performance and navigation upgrade

The initial shell now renders directly without a black loading gate. Heavy modules are loaded on demand through `next/dynamic`, including the Monaco workspace, live preview, Academy, Marketplace, deployment modals, and command palette. Export dependencies are also loaded only when a user requests a ZIP export. The primary Header exposes concise desktop links, while the full navigation is available through a responsive, collapsible sidebar.

## 🛍️ Marketplace and plans

The Marketplace catalog is defined in `src/data/marketplaceCatalog.ts` and includes 20+ starter items across Websites, Cloud & SaaS, E-Commerce, Apps & Services, and Schemas & APIs. Each item supports search, category filtering, live preview, workspace installation, and deployment preparation. Pricing includes Free, Pro at $20/month, Enterprise custom, and a separate Ad-Engine with Starter ($10), Growth ($25), and Scale ($50+) workflow-credit packs.

Checkout is provider-safe: production Stripe sessions require server-side price IDs such as `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_AD_STARTER`. Sandbox success is disabled by default and can only be enabled explicitly for local development with `ALLOW_SANDBOX_CHECKOUT=true`. Apple Pay is presented through Stripe wallet support; PayPal and Binance Pay remain explicit provider adapters until their server credentials and signed webhooks are configured.


## 🎓 CloudForge Academy Learning Center

The Academy now presents three engineering paths: **Full-Stack AI Cloud Architecture**, **Supabase & Database Engineering**, and **Agentic AI & Automation Workflows**. Each path includes lesson navigation, video or visual theory briefing, a safe deterministic code sandbox, quiz support, progress percentage, completed hours, XP, and skill badges. The sandbox never executes untrusted learner code on the server; it performs bounded static checks before allowing lesson completion.

Learner state is persisted locally under the versioned `cloudforge_user_progress_v2` key. Production-grade grading, video hosting, identity-linked transcripts, and certificate verification should be connected to authenticated server storage before being used as an official academic record.


## 🏅 Verified Digital Certificate Engine

Academy graduates can preview a branded **CERTIFICATE OF PROFICIENCY & COMPLETION** with CloudForge International Engineering Academy branding, student identity, professional title, certificate ID, score, issue date, gold seal, signatures, and a QR code targeting `/verify/{certificateId}`. The certificate action bar supports browser print-to-PDF, LinkedIn sharing, X sharing, and copying the public verification link.

The public route `/verify/[certificateId]` uses `/api/verify/[certificateId]` and accepts both new `CF-*` IDs and legacy `CVX-ACADEMY-*` IDs. The API returns a valid record only when `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a protected `certificates` table are configured. Without those production settings it explicitly reports `registry_unavailable`; it never presents a local preview as an officially verified credential.

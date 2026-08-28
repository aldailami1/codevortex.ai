# CloudForge

**Enterprise Cloud Engineering, AI Automation, and Learning Platform**

CloudForge is an AI-native cloud workstation for designing, building, securing, learning, and deploying modern digital products. The platform combines a visual no-code/low-code builder, isolated Supabase database workflows, guarded deployment preparation, an AI monetization workspace, and CloudForge International Engineering Academy.

## Company profile

CloudForge helps engineering teams, independent builders, agencies, and learners move from an idea to a governed cloud implementation. The product is designed around transparent provider boundaries: the UI can prepare workspaces, schemas, campaigns, deployments, support actions, and learning credentials, while production execution remains controlled by authenticated providers, signed webhooks, role-based access controls, and explicit approvals.

## Platform capabilities

| Module | Scope |
|---|---|
| Visual builder | Prompt-assisted full-stack generation, a responsive workstation, preview workflows, export, and low-code project operations. |
| Cloud data | Supabase PostgreSQL schemas, RLS-aware access design, project workspaces, audit events, and isolated backend preparation. |
| Deployment | Vercel/Netlify deployment preparation, domain and SSL workflow states, build logs, and approval-aware actions. |
| Monetization | Campaign drafts, ad-engine products, campaign balance concepts, and provider-safe billing flows. External ad publication requires configured provider credentials and approval. |
| Academy | Three engineering paths, lessons, quizzes, static code labs, progress tracking, skill badges, certificate previews, and public credential verification. |
| Customer service | Floating AI support widget, contextual knowledge, conversation memory, message logs, ticket workflow, and a full departmental support portal. |

## Architecture overview

CloudForge uses Next.js 15 with the App Router, React 19, TypeScript, and Tailwind CSS v4. The browser renders a mobile-first shell and loads heavy interactive surfaces on demand. Server routes validate input, keep provider secrets outside the browser, and return explicit provider or configuration states rather than simulated production success.

```text
Browser UI
  ├── App shell, responsive Header/Sidebar/Footer
  ├── Visual Builder, Marketplace, Control Center, Academy
  ├── Floating Support Widget and Departmental Support Portal
  └── Certificate preview and public verification page
        │
        ├── Next.js App Router API routes
        │     ├── AI generation and support context orchestration
        │     ├── Ticket creation and support message persistence
        │     ├── Billing and provider-safe checkout
        │     └── Certificate registry verification
        │
        ├── Supabase PostgreSQL
        │     ├── Profiles, workspaces, projects, deployments
        │     ├── Support conversations and message memory
        │     ├── Tickets, ticket messages, webhook idempotency
        │     └── RLS policies, indexes, triggers, audit logs
        │
        └── External providers
              ├── OpenAI-compatible support and generation provider
              ├── Stripe Checkout and wallet support
              ├── Vercel/Netlify deployment providers
              └── Optional ad, email, and webhook providers
```

## Repository structure

```text
src/app/                         Next.js App Router pages and API routes
src/components/                 UI modules and responsive application surfaces
src/data/                       Marketplace catalog and Academy curriculum
src/lib/supportContext.ts       CloudForge support system context and FAQ routing
src/lib/supabase.ts              SSR-safe Supabase browser/server clients
src/types/                      Shared product, academy, certificate, and support types
supabase/migrations/             Ordered executable database migrations
supabase/schema.sql              Single executable schema bundle, migrations 0001–0005
supabase/functions/              Provider webhook and edge-function integrations
tests/                           Vitest and Testing Library coverage
.env.example                     Safe environment contract with no credentials
```

## Customer service AI engine

The support engine is implemented in `src/app/api/support/chat/route.ts`. It combines the CloudForge product context, a deterministic FAQ layer, recent conversation history, and an optional OpenAI-compatible model. Each request is capped at 4,000 characters. The assistant replies in the user’s language, avoids requesting secrets, and never claims that it charged a card, changed an account, opened a ticket, or deployed a project unless an API confirms that action.

When the server has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, conversations and messages are persisted in `support_conversations` and `support_messages`. The service role is used only on the server. Without those variables, the product returns a clear deterministic fallback and reports that persistence is unavailable; it does not pretend that memory was saved.

The full dashboard is provided by `DepartmentalSupportPortal`. Ticket persistence is governed by authenticated Supabase policies and can be connected to email, Slack, CRM, or human escalation workers through signed webhook handlers. Webhook event IDs are stored for idempotency.

## Academy and digital certification

CloudForge International Engineering Academy offers:

1. **Full-Stack AI Cloud Architecture**
2. **Supabase & Database Engineering**
3. **Agentic AI & Automation Workflows**

Each path includes guided lessons, visual theory briefings, video slots, quizzes, an intentionally bounded static code sandbox, automatic evaluation, XP, progress percentage, completed learning hours, and skill badges. Learner code is not executed as arbitrary server-side code. Official academic records require authenticated server storage and a separately governed assessment runner.

The certificate engine renders the `CERTIFICATE OF PROFICIENCY & COMPLETION` layout with CloudForge branding, a professional title, certificate ID, score, date, gold seal, signatures, QR verification link, print/PDF export, LinkedIn sharing, X sharing, and link copying. Public verification is available at `/verify/[certificateId]` and uses `/api/verify/[certificateId]`.

A certificate is considered officially valid only when the protected `certificates` registry is configured. The public route returns explicit `registry_unavailable`, `not_found`, or `revoked` states when the registry cannot verify a record. A local preview is never presented as an official credential.

## Database and security

Run `supabase/schema.sql` for the complete ordered schema bundle, or apply the files in `supabase/migrations/` in numerical order. The schema includes core CloudForge entities, role-aware RLS, support conversations, message memory, tickets, ticket messages, webhook idempotency, indexes, triggers, and audit structures.

The production database must use RLS on every user-owned table. Service-role credentials belong only in server-side environment variables. Do not place API keys, payment secrets, passwords, or private tokens in the browser, repository, support messages, or logs. Rotate any credential that has been exposed.

## Local development

**Prerequisites:** Node.js 20 or newer and a Supabase project for persistence-enabled development.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The local application runs at `http://localhost:3000`. It can render the frontend without provider credentials, but production capabilities remain disabled until the relevant environment variables and database policies are configured.

## Verification commands

```bash
npm run typecheck
npm test
npm run build
```

The repository’s CI workflow runs the same typecheck, test, and production build stages for pushes and pull requests. Run all three commands before promoting a release.

## Vercel deployment

Import the repository into Vercel as a Next.js project and use `npm run build` as the build command. Add the required variables from `.env.example` in the Vercel project environment, separating Preview and Production values. At minimum, production persistence requires Supabase URL, Supabase anon key, and the server-only Supabase service-role key. AI support requires `OPENAI_API_KEY`; Stripe requires its secret, webhook secret, and configured server-side price IDs.

Apply `supabase/schema.sql` to the target Supabase project before enabling conversation memory, ticket persistence, certificate verification, or any production workflow that depends on those tables. Configure signed webhook endpoints and idempotency before accepting provider events. Keep `ALLOW_SANDBOX_CHECKOUT=false` in every production environment.

## Operational boundaries

CloudForge is designed to be honest about integrations. It does not silently patch external systems, replace a production WAF/CDN, publish advertising campaigns without approval, or enable hidden revenue sharing. Production activation requires provider credentials, signed webhooks, rate limits, audit logs, RLS policies, monitoring, and explicit account configuration.

## License

Private and proprietary. Copyright 2026 CloudForge.


### Support persistence and operations

The executable schema bundle now includes `support_conversations`, `support_messages`, `support_ticket_messages`, and `support_webhook_events` in addition to the existing ticket tables. These structures provide conversation memory, role-scoped message history, ticket collaboration, and provider-event idempotency. The chat and ticket routes use the server-only service role when configured and return explicit persistence status when the database is unavailable.

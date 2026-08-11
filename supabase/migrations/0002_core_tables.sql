-- ============================================================
-- CloudForge — 0002: Core Tables
-- profiles, workspaces, projects, deployments, api_keys,
-- subscriptions, invoices, templates, workflows, webhooks,
-- notifications, support_tickets, audit_logs, ai_usage
-- ============================================================

-- ------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
    id            uuid primary key references auth.users (id) on delete cascade,
    full_name     text not null default '',
    email         text not null,
    avatar_url    text,
    role          app_role not null default 'free_user',
    plan          text not null default 'free',             -- free | pro | enterprise
    is_verified   boolean not null default false,
    otp_code      varchar(10),
    otp_expires_at timestamptz,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- WORKSPACES
-- ------------------------------------------------------------
create table if not exists public.workspaces (
    id           uuid primary key default gen_random_uuid(),
    owner_id     uuid not null references public.profiles (id) on delete cascade,
    name         text not null,
    slug         text unique not null,
    plan         text not null default 'free',
    settings     jsonb not null default '{}'::jsonb,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- workspace membership (developers invited to a workspace)
create table if not exists public.workspace_members (
    workspace_id uuid not null references public.workspaces (id) on delete cascade,
    profile_id   uuid not null references public.profiles (id) on delete cascade,
    member_role  app_role not null default 'developer',
    joined_at    timestamptz not null default now(),
    primary key (workspace_id, profile_id)
);

-- ------------------------------------------------------------
-- PROJECTS (inside workspaces)
-- ------------------------------------------------------------
create table if not exists public.projects (
    id             uuid primary key default gen_random_uuid(),
    workspace_id   uuid not null references public.workspaces (id) on delete cascade,
    owner_id       uuid not null references public.profiles (id) on delete cascade,
    title          text not null,
    description    text,
    status         project_status not null default 'active',
    language       text not null default 'en',
    is_rtl         boolean not null default false,
    schema_json    jsonb default '{}'::jsonb,              -- CloudForgeEngine schema
    files_json     jsonb default '[]'::jsonb not null,     -- generated project files
    runtime_port   int not null default 3000,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- DEPLOYMENTS
-- ------------------------------------------------------------
create table if not exists public.deployments (
    id             uuid primary key default gen_random_uuid(),
    project_id     uuid not null references public.projects (id) on delete cascade,
    workspace_id   uuid not null references public.workspaces (id) on delete cascade,
    status         deployment_status not null default 'queued',
    provider       text not null default 'vercel',         -- vercel | netlify
    environment    text not null default 'production',     -- production | preview
    deployment_url text,
    build_logs     text,
    triggered_by   uuid references public.profiles (id) on delete set null,
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

-- ------------------------------------------------------------
-- API KEYS (encrypted at rest)
-- ------------------------------------------------------------
create table if not exists public.api_keys (
    id           uuid primary key default gen_random_uuid(),
    profile_id   uuid not null references public.profiles (id) on delete cascade,
    name         text not null,
    key_prefix   text not null,                             -- visible prefix e.g. cf_live_…
    key_hash     text not null unique,                      -- sha256 of the secret
    scopes       text[] not null default '{}',              -- e.g. {projects:read, deploy:write}
    last_used_at timestamptz,
    expires_at   timestamptz,
    created_at   timestamptz not null default now(),
    revoked_at   timestamptz
);

-- ------------------------------------------------------------
-- SUBSCRIPTIONS & INVOICES (Stripe + Crypto)
-- ------------------------------------------------------------
create table if not exists public.subscriptions (
    id                uuid primary key default gen_random_uuid(),
    profile_id        uuid not null references public.profiles (id) on delete cascade,
    workspace_id      uuid references public.workspaces (id) on delete set null,
    provider          payment_provider not null default 'stripe',
    provider_ref      text unique,                          -- stripe subscription id / tx hash
    plan              text not null,
    billing_cycle     text not null default 'monthly',
    status            subscription_status not null default 'active',
    current_period_end timestamptz,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now()
);

create table if not exists public.invoices (
    id            uuid primary key default gen_random_uuid(),
    subscription_id uuid references public.subscriptions (id) on delete set null,
    profile_id    uuid not null references public.profiles (id) on delete cascade,
    provider      payment_provider not null default 'stripe',
    provider_ref  text,
    amount_cents  bigint not null default 0,
    currency      text not null default 'usd',
    status        text not null default 'paid',
    paid_at       timestamptz,
    created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TEMPLATES (Marketplace)
-- ------------------------------------------------------------
create table if not exists public.templates (
    id              uuid primary key default gen_random_uuid(),
    author_id       uuid references public.profiles (id) on delete set null,
    title           text not null,
    title_ar        text,
    description     text,
    description_ar  text,
    category        text not null default 'saas',           -- saas | ecommerce | dashboard | ai | landing
    badge           text,
    image_url       text,
    files_json      jsonb not null default '[]'::jsonb,     -- starter ProjectFile[]
    published       boolean not null default true,
    downloads       int not null default 0,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- WORKFLOW AUTOMATION (Zapier/Make-like engine)
-- ------------------------------------------------------------
create table if not exists public.workflows (
    id            uuid primary key default gen_random_uuid(),
    workspace_id  uuid not null references public.workspaces (id) on delete cascade,
    name          text not null,
    trigger_type  text not null default 'webhook',          -- webhook | event | schedule
    trigger_config jsonb not null default '{}'::jsonb,
    actions       jsonb not null default '[]'::jsonb,       -- [{type, config}]
    status        workflow_status not null default 'draft',
    run_count     int not null default 0,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create table if not exists public.workflow_runs (
    id           uuid primary key default gen_random_uuid(),
    workflow_id  uuid not null references public.workflows (id) on delete cascade,
    status       text not null default 'running',           -- running | success | failed
    input        jsonb default '{}'::jsonb,
    output       jsonb default '{}'::jsonb,
    error        text,
    started_at   timestamptz not null default now(),
    finished_at  timestamptz
);

-- ------------------------------------------------------------
-- WEBHOOK ENDPOINTS & EVENTS (outgoing + incoming)
-- ------------------------------------------------------------
create table if not exists public.webhook_endpoints (
    id            uuid primary key default gen_random_uuid(),
    workspace_id  uuid not null references public.workspaces (id) on delete cascade,
    name          text not null,
    url           text not null,
    secret        text,                                     -- HMAC secret
    events        text[] not null default '{}',             -- subscribed event names
    is_active     boolean not null default true,
    created_at    timestamptz not null default now()
);

create table if not exists public.webhook_events (
    id            uuid primary key default gen_random_uuid(),
    endpoint_id   uuid references public.webhook_endpoints (id) on delete set null,
    event         text not null,
    payload       jsonb not null default '{}'::jsonb,
    status        webhook_delivery_status not null default 'pending',
    attempts      int not null default 0,
    response_code int,
    created_at    timestamptz not null default now(),
    delivered_at  timestamptz
);

-- ------------------------------------------------------------
-- NOTIFICATIONS (push / realtime)
-- ------------------------------------------------------------
create table if not exists public.notifications (
    id           uuid primary key default gen_random_uuid(),
    profile_id   uuid not null references public.profiles (id) on delete cascade,
    title        text not null,
    body         text,
    icon         text,
    link         text,
    is_read      boolean not null default false,
    created_at   timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
    id            uuid primary key default gen_random_uuid(),
    profile_id    uuid not null references public.profiles (id) on delete cascade,
    endpoint      text not null unique,
    p256dh        text not null,
    auth          text not null,
    user_agent    text,
    created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SUPPORT TICKETS (multi-department)
-- ------------------------------------------------------------
create table if not exists public.support_tickets (
    id            uuid primary key default gen_random_uuid(),
    profile_id    uuid references public.profiles (id) on delete set null,
    magic_key     text unique,
    user_email    text not null,
    department    ticket_category not null default 'technical',
    subject       text not null,
    message       text not null,
    attachments   jsonb default '[]'::jsonb,
    status        ticket_status not null default 'open',
    priority      int not null default 3,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create table if not exists public.ticket_messages (
    id          uuid primary key default gen_random_uuid(),
    ticket_id   uuid not null references public.support_tickets (id) on delete cascade,
    author_id   uuid references public.profiles (id) on delete set null,
    author_name text not null,
    content     text not null,
    created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- AUDIT LOGS
-- ------------------------------------------------------------
create table if not exists public.audit_logs (
    id           uuid primary key default gen_random_uuid(),
    profile_id   uuid references public.profiles (id) on delete set null,
    user_email   text,
    action       text not null,
    details      jsonb default '{}'::jsonb,
    ip_address   inet,
    user_agent   text,
    created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- AI USAGE METERING
-- ------------------------------------------------------------
create table if not exists public.ai_usage (
    id           uuid primary key default gen_random_uuid(),
    profile_id   uuid references public.profiles (id) on delete set null,
    workspace_id uuid references public.workspaces (id) on delete set null,
    provider     text not null default 'fallback',          -- openai | anthropic | gemini | fallback
    model        text,
    action       text not null,                             -- generate | refine | chat
    tokens_in    int not null default 0,
    tokens_out   int not null default 0,
    duration_ms  int,
    created_at   timestamptz not null default now()
);

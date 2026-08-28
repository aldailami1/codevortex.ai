-- CloudForge executable schema bundle
-- Applies migrations 0001 through 0005 in order.

-- ===== supabase/migrations/0001_extensions_and_enums.sql =====
-- ============================================================
-- CloudForge — 0001: Extensions & Enums
-- Enterprise Supabase schema (PostgreSQL 15+)
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";          -- fuzzy search on titles/emails
create extension if not exists "moddatetime";       -- updated_at triggers

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
do $$
begin
    if not exists (select 1 from pg_type where typname = 'app_role') then
        create type app_role as enum (
            'super_admin',   -- platform owners
            'admin',         -- org administrators
            'enterprise',    -- enterprise seats
            'developer',     -- pro developers
            'free_user'      -- hobby / free tier
        );
    end if;

    if not exists (select 1 from pg_type where typname = 'project_status') then
        create type project_status as enum ('active', 'building', 'deployed', 'archived');
    end if;

    if not exists (select 1 from pg_type where typname = 'deployment_status') then
        create type deployment_status as enum ('queued', 'building', 'deployed', 'failed', 'rolled_back');
    end if;

    if not exists (select 1 from pg_type where typname = 'ticket_status') then
        create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
    end if;

    if not exists (select 1 from pg_type where typname = 'ticket_category') then
        create type ticket_category as enum ('technical', 'deployment', 'billing', 'security', 'sales', 'executive');
    end if;

    if not exists (select 1 from pg_type where typname = 'subscription_status') then
        create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
    end if;

    if not exists (select 1 from pg_type where typname = 'payment_provider') then
        create type payment_provider as enum ('stripe', 'crypto');
    end if;

    if not exists (select 1 from pg_type where typname = 'workflow_status') then
        create type workflow_status as enum ('draft', 'active', 'paused', 'archived');
    end if;

    if not exists (select 1 from pg_type where typname = 'webhook_delivery_status') then
        create type webhook_delivery_status as enum ('pending', 'delivered', 'failed', 'retrying');
    end if;
end $$;

-- ===== supabase/migrations/0002_core_tables.sql =====
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

-- ===== supabase/migrations/0003_rbac_and_rls.sql =====
-- ============================================================
-- CloudForge — 0003: RBAC Helpers, Triggers & RLS Policies
-- Roles: super_admin, admin, enterprise, developer, free_user
-- ============================================================

-- ------------------------------------------------------------
-- Helper functions
-- ------------------------------------------------------------
-- Return the app_role of the authenticated user (or NULL).
create or replace function public.current_app_role()
returns app_role
language sql stable security definer set search_path = public
as $$
    select role from public.profiles where id = auth.uid();
$$;

-- Is the user a super_admin?
create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
    select coalesce((select role from public.profiles where id = auth.uid()) = 'super_admin', false);
$$;

-- Is the user an admin (super_admin or admin)?
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
    select coalesce(
        (select role from public.profiles where id = auth.uid()) in ('super_admin', 'admin'),
        false
    );
$$;

-- Can the user access a given workspace?
create or replace function public.can_access_workspace(ws_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
    select exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = ws_id and wm.profile_id = auth.uid()
    ) or exists (
        select 1 from public.workspaces w
        where w.id = ws_id and w.owner_id = auth.uid()
    );
$$;

-- Can the user access a given project (via its workspace)?
create or replace function public.can_access_project(proj_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
    select exists (
        select 1 from public.projects p
        where p.id = proj_id
          and (p.owner_id = auth.uid() or public.can_access_workspace(p.workspace_id))
    );
$$;

-- Handle new auth.users -> profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, email, role)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', ''),
        coalesce(new.email, ''),
        'free_user'
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- updated_at trigger helper
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- ------------------------------------------------------------
-- RLS: enable on all tables
-- ------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.workspaces          enable row level security;
alter table public.workspace_members   enable row level security;
alter table public.projects            enable row level security;
alter table public.deployments         enable row level security;
alter table public.api_keys            enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.invoices            enable row level security;
alter table public.templates           enable row level security;
alter table public.workflows           enable row level security;
alter table public.workflow_runs       enable row level security;
alter table public.webhook_endpoints   enable row level security;
alter table public.webhook_events      enable row level security;
alter table public.notifications       enable row level security;
alter table public.push_subscriptions  enable row level security;
alter table public.support_tickets     enable row level security;
alter table public.ticket_messages     enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.ai_usage            enable row level security;

-- ============================================================
-- RLS POLICIES (role-aware)
-- ============================================================

-- ---------------- PROFILES ----------------
-- Users manage their own profile; admins read everyone.
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
    for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
    for update using (id = auth.uid())
    with check (id = auth.uid());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert" on public.profiles
    for insert with check (public.is_admin() or id = auth.uid());

-- ---------------- WORKSPACES ----------------
-- Owners & admins manage; members see.
drop policy if exists "workspaces_select" on public.workspaces;
create policy "workspaces_select" on public.workspaces
    for select using (owner_id = auth.uid() or public.can_access_workspace(id) or public.is_admin());

drop policy if exists "workspaces_insert" on public.workspaces;
create policy "workspaces_insert" on public.workspaces
    for insert with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "workspaces_update" on public.workspaces;
create policy "workspaces_update" on public.workspaces
    for update using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "workspaces_delete" on public.workspaces;
create policy "workspaces_delete" on public.workspaces
    for delete using (owner_id = auth.uid() or public.is_super_admin());

-- ---------------- WORKSPACE MEMBERS ----------------
drop policy if exists "members_select" on public.workspace_members;
create policy "members_select" on public.workspace_members
    for select using (profile_id = auth.uid() or public.can_access_workspace(workspace_id) or public.is_admin());

drop policy if exists "members_manage" on public.workspace_members;
create policy "members_manage" on public.workspace_members
    for all using (
        public.is_admin()
        or exists (select 1 from public.workspaces w where w.id = workspace_id and (w.owner_id = auth.uid() or w.settings ->> 'anyone_can_invite' = 'true'))
    );

-- ---------------- PROJECTS ----------------
drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects
    for select using (public.can_access_project(id) or public.is_admin());

drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert" on public.projects
    for insert with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "projects_update" on public.projects;
create policy "projects_update" on public.projects
    for update using (public.can_access_project(id))
    with check (public.can_access_project(id));

drop policy if exists "projects_delete" on public.projects;
create policy "projects_delete" on public.projects
    for delete using (owner_id = auth.uid() or public.is_super_admin());

-- ---------------- DEPLOYMENTS ----------------
drop policy if exists "deployments_select" on public.deployments;
create policy "deployments_select" on public.deployments
    for select using (
        public.is_admin()
        or exists (select 1 from public.projects p where p.id = project_id and public.can_access_project(p.id))
    );

drop policy if exists "deployments_insert" on public.deployments;
create policy "deployments_insert" on public.deployments
    for insert with check (
        public.is_admin()
        or exists (select 1 from public.projects p where p.id = project_id and public.can_access_project(p.id))
    );

drop policy if exists "deployments_update" on public.deployments;
create policy "deployments_update" on public.deployments
    for update using (
        public.is_admin()
        or exists (select 1 from public.projects p where p.id = project_id and public.can_access_project(p.id))
    );

-- ---------------- API KEYS (secret never exposed) ----------------
drop policy if exists "api_keys_select" on public.api_keys;
create policy "api_keys_select" on public.api_keys
    for select using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "api_keys_insert" on public.api_keys;
create policy "api_keys_insert" on public.api_keys
    for insert with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists "api_keys_update" on public.api_keys;
create policy "api_keys_update" on public.api_keys
    for update using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "api_keys_delete" on public.api_keys;
create policy "api_keys_delete" on public.api_keys
    for delete using (profile_id = auth.uid() or public.is_super_admin());

-- ---------------- SUBSCRIPTIONS / INVOICES ----------------
drop policy if exists "subscriptions_select" on public.subscriptions;
create policy "subscriptions_select" on public.subscriptions
    for select using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "invoices_select" on public.invoices;
create policy "invoices_select" on public.invoices
    for select using (profile_id = auth.uid() or public.is_admin());

-- ---------------- TEMPLATES (public marketplace read; authors write) ----------------
drop policy if exists "templates_public_read" on public.templates;
create policy "templates_public_read" on public.templates
    for select using (published = true or author_id = auth.uid() or public.is_admin());

drop policy if exists "templates_author_write" on public.templates;
create policy "templates_author_write" on public.templates
    for insert with check (author_id = auth.uid() or public.is_admin());

drop policy if exists "templates_author_update" on public.templates;
create policy "templates_author_update" on public.templates
    for update using (author_id = auth.uid() or public.is_admin());

-- ---------------- WORKFLOWS & RUNS ----------------
drop policy if exists "workflows_select" on public.workflows;
create policy "workflows_select" on public.workflows
    for select using (public.can_access_workspace(workspace_id) or public.is_admin());

drop policy if exists "workflows_write" on public.workflows;
create policy "workflows_write" on public.workflows
    for all using (public.can_access_workspace(workspace_id) or public.is_admin())
    with check (public.can_access_workspace(workspace_id) or public.is_admin());

drop policy if exists "workflow_runs_select" on public.workflow_runs;
create policy "workflow_runs_select" on public.workflow_runs
    for select using (
        public.is_admin()
        or exists (select 1 from public.workflows w where w.id = workflow_id and public.can_access_workspace(w.workspace_id))
    );

-- ---------------- WEBHOOKS ----------------
drop policy if exists "webhook_endpoints_select" on public.webhook_endpoints;
create policy "webhook_endpoints_select" on public.webhook_endpoints
    for select using (public.can_access_workspace(workspace_id) or public.is_admin());

drop policy if exists "webhook_endpoints_write" on public.webhook_endpoints;
create policy "webhook_endpoints_write" on public.webhook_endpoints
    for all using (public.can_access_workspace(workspace_id) or public.is_admin())
    with check (public.can_access_workspace(workspace_id) or public.is_admin());

-- webhook events: service-role only (no direct user writes)
drop policy if exists "webhook_events_read" on public.webhook_events;
create policy "webhook_events_read" on public.webhook_events
    for select using (
        public.is_admin()
        or exists (select 1 from public.webhook_endpoints e where e.id = endpoint_id and public.can_access_workspace(e.workspace_id))
    );

-- ---------------- NOTIFICATIONS & PUSH ----------------
drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications
    for all using (profile_id = auth.uid())
    with check (profile_id = auth.uid());

drop policy if exists "push_subscriptions_own" on public.push_subscriptions;
create policy "push_subscriptions_own" on public.push_subscriptions
    for all using (profile_id = auth.uid())
    with check (profile_id = auth.uid());

-- ---------------- SUPPORT TICKETS ----------------
-- Authenticated users create; owners/agents resolve.
drop policy if exists "tickets_insert" on public.support_tickets;
create policy "tickets_insert" on public.support_tickets
    for insert with check (auth.uid() is not null or public.is_admin());

drop policy if exists "tickets_select" on public.support_tickets;
create policy "tickets_select" on public.support_tickets
    for select using (profile_id = auth.uid() or public.is_admin() or user_email = coalesce(auth.jwt() ->> 'email', ''));

drop policy if exists "tickets_update" on public.support_tickets;
create policy "tickets_update" on public.support_tickets
    for update using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "ticket_messages_select" on public.ticket_messages;
create policy "ticket_messages_select" on public.ticket_messages
    for select using (
        public.is_admin()
        or exists (select 1 from public.support_tickets t where t.id = ticket_id and (t.profile_id = auth.uid() or t.user_email = coalesce(auth.jwt() ->> 'email', '')))
    );

drop policy if exists "ticket_messages_insert" on public.ticket_messages;
create policy "ticket_messages_insert" on public.ticket_messages
    for insert with check (public.is_admin() or auth.uid() is not null);

-- ---------------- AUDIT LOGS (insert-only for users, read for admins) ----------------
drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read" on public.audit_logs
    for select using (public.is_admin());

drop policy if exists "audit_logs_insert" on public.audit_logs;
create policy "audit_logs_insert" on public.audit_logs
    for insert with check (auth.uid() is not null);

-- ---------------- AI USAGE (owner reads, service writes) ----------------
drop policy if exists "ai_usage_select" on public.ai_usage;
create policy "ai_usage_select" on public.ai_usage
    for select using (profile_id = auth.uid() or public.is_admin());

-- ===== supabase/migrations/0004_indexes_triggers_realtime.sql =====
-- ============================================================
-- CloudForge — 0004: Indexes, Triggers, Realtime & Storage
-- ============================================================

-- ------------------------------------------------------------
-- PERFORMANCE INDEXES
-- ------------------------------------------------------------
create index if not exists idx_profiles_email       on public.profiles (email);
create index if not exists idx_profiles_role        on public.profiles (role);

create index if not exists idx_workspaces_owner     on public.workspaces (owner_id);
create index if not exists idx_workspaces_slug      on public.workspaces (slug);
create index if not exists idx_workspace_members_profile on public.workspace_members (profile_id);

create index if not exists idx_projects_workspace   on public.projects (workspace_id);
create index if not exists idx_projects_owner       on public.projects (owner_id);
create index if not exists idx_projects_status      on public.projects (status);
create index if not exists idx_projects_title_trgm  on public.projects using gin (title gin_trgm_ops);

create index if not exists idx_deployments_project  on public.deployments (project_id);
create index if not exists idx_deployments_status   on public.deployments (status);

create index if not exists idx_api_keys_profile     on public.api_keys (profile_id);
create index if not exists idx_api_keys_prefix      on public.api_keys (key_prefix);

create index if not exists idx_subscriptions_profile on public.subscriptions (profile_id);
create index if not exists idx_subscriptions_status  on public.subscriptions (status);
create index if not exists idx_invoices_profile      on public.invoices (profile_id);

create index if not exists idx_templates_category   on public.templates (category);
create index if not exists idx_templates_author     on public.templates (author_id);
create index if not exists idx_templates_title_trgm on public.templates using gin (title gin_trgm_ops);

create index if not exists idx_workflows_workspace  on public.workflows (workspace_id);
create index if not exists idx_workflow_runs_workflow on public.workflow_runs (workflow_id);
create index if not exists idx_webhook_events_status on public.webhook_events (status);

create index if not exists idx_notifications_profile on public.notifications (profile_id, is_read);
create index if not exists idx_tickets_email        on public.support_tickets (user_email);
create index if not exists idx_tickets_status       on public.support_tickets (status);
create index if not exists idx_ticket_messages_ticket on public.ticket_messages (ticket_id);

create index if not exists idx_audit_logs_profile   on public.audit_logs (profile_id);
create index if not exists idx_audit_logs_created   on public.audit_logs (created_at desc);
create index if not exists idx_ai_usage_profile     on public.ai_usage (profile_id, created_at desc);

-- ------------------------------------------------------------
-- updated_at TRIGGERS
-- ------------------------------------------------------------
create trigger trg_profiles_updated   before update on public.profiles          for each row execute procedure public.touch_updated_at();
create trigger trg_workspaces_updated before update on public.workspaces        for each row execute procedure public.touch_updated_at();
create trigger trg_projects_updated   before update on public.projects          for each row execute procedure public.touch_updated_at();
create trigger trg_deployments_updated before update on public.deployments      for each row execute procedure public.touch_updated_at();
create trigger trg_subscriptions_updated before update on public.subscriptions  for each row execute procedure public.touch_updated_at();
create trigger trg_templates_updated  before update on public.templates         for each row execute procedure public.touch_updated_at();
create trigger trg_workflows_updated  before update on public.workflows         for each row execute procedure public.touch_updated_at();
create trigger trg_tickets_updated    before update on public.support_tickets   for each row execute procedure public.touch_updated_at();

-- ------------------------------------------------------------
-- REALTIME (WebSocket streams for live dashboards & build logs)
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.deployments;
alter publication supabase_realtime add table public.workflow_runs;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.webhook_events;
alter publication supabase_realtime add table public.projects;

-- ------------------------------------------------------------
-- STORAGE BUCKETS
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
    ('project-files', 'project-files', false),
    ('ticket-attachments', 'ticket-attachments', false),
    ('template-images', 'template-images', true)
on conflict (id) do nothing;

-- storage policies (RLS-aware)
drop policy if exists "ticket_attachments_upload" on storage.objects;
create policy "ticket_attachments_upload" on storage.objects
    for insert with check (bucket_id = 'ticket-attachments' and auth.uid() is not null);

drop policy if exists "ticket_attachments_read" on storage.objects;
create policy "ticket_attachments_read" on storage.objects
    for select using (bucket_id = 'ticket-attachments' and auth.uid() is not null);

drop policy if exists "template_images_public_read" on storage.objects;
create policy "template_images_public_read" on storage.objects
    for select using (bucket_id = 'template-images');

-- ------------------------------------------------------------
-- SEED: super admin bootstrap (run once, then remove/rotate)
-- ------------------------------------------------------------
-- NOTE: auth.users must exist first; run via the dashboard or a
-- service-role script. This grants the first profile the top role.
-- update public.profiles set role = 'super_admin' where email = 'admin@cloudforge.app';

-- ===== supabase/migrations/0005_support_conversations_and_memory.sql =====
-- CloudForge Support Intelligence — conversation memory, message logs, and ticket workflow.
-- Run after migrations 0001–0004. Service-role API routes bypass RLS; browser clients do not.

create table if not exists public.support_conversations (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid references public.profiles (id) on delete set null,
    channel text not null default 'web_widget' check (channel in ('web_widget', 'dashboard', 'email', 'api')),
    language text not null default 'en' check (language in ('en', 'ar', 'es', 'fr', 'de')),
    status text not null default 'open' check (status in ('open', 'pending_human', 'resolved', 'closed')),
    assigned_team text,
    summary text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    closed_at timestamptz
);

create table if not exists public.support_messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.support_conversations (id) on delete cascade,
    profile_id uuid references public.profiles (id) on delete set null,
    role text not null check (role in ('user', 'assistant', 'agent', 'system')),
    content text not null check (char_length(content) between 1 and 12000),
    provider text,
    model text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid references public.support_conversations (id) on delete set null,
    profile_id uuid references public.profiles (id) on delete set null,
    requester_email text not null,
    subject text not null check (char_length(subject) between 3 and 240),
    description text not null check (char_length(description) between 3 and 20000),
    category text not null default 'technical' check (category in ('technical', 'billing', 'deployment', 'security', 'sales', 'academic', 'other')),
    status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),
    priority smallint not null default 3 check (priority between 1 and 5),
    assigned_team text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    resolved_at timestamptz
);

create table if not exists public.support_ticket_messages (
    id uuid primary key default gen_random_uuid(),
    ticket_id uuid not null references public.support_tickets (id) on delete cascade,
    profile_id uuid references public.profiles (id) on delete set null,
    author_role text not null check (author_role in ('requester', 'agent', 'system')),
    content text not null check (char_length(content) between 1 and 12000),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table if not exists public.support_webhook_events (
    id uuid primary key default gen_random_uuid(),
    provider text not null,
    event_id text not null,
    event_type text not null,
    payload_hash text not null,
    received_at timestamptz not null default now(),
    processed_at timestamptz,
    status text not null default 'received' check (status in ('received', 'processed', 'failed', 'ignored')),
    unique (provider, event_id)
);

create index if not exists idx_support_conversations_profile_updated on public.support_conversations(profile_id, updated_at desc);
create index if not exists idx_support_messages_conversation_created on public.support_messages(conversation_id, created_at asc);
create index if not exists idx_support_tickets_profile_status on public.support_tickets(profile_id, status, updated_at desc);
create index if not exists idx_support_ticket_messages_ticket_created on public.support_ticket_messages(ticket_id, created_at asc);
create index if not exists idx_support_webhook_events_provider_event on public.support_webhook_events(provider, event_id);

create or replace function public.touch_support_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_support_conversations_updated_at on public.support_conversations;
create trigger trg_support_conversations_updated_at before update on public.support_conversations for each row execute function public.touch_support_updated_at();
drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at before update on public.support_tickets for each row execute function public.touch_support_updated_at();

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;
alter table public.support_webhook_events enable row level security;

drop policy if exists support_conversations_owner_select on public.support_conversations;
create policy support_conversations_owner_select on public.support_conversations for select using (profile_id = auth.uid() or public.is_admin());
drop policy if exists support_conversations_owner_insert on public.support_conversations;
create policy support_conversations_owner_insert on public.support_conversations for insert with check (profile_id = auth.uid() or public.is_admin());
drop policy if exists support_conversations_owner_update on public.support_conversations;
create policy support_conversations_owner_update on public.support_conversations for update using (profile_id = auth.uid() or public.is_admin()) with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists support_messages_owner_select on public.support_messages;
create policy support_messages_owner_select on public.support_messages for select using (public.is_admin() or exists (select 1 from public.support_conversations c where c.id = conversation_id and c.profile_id = auth.uid()));
drop policy if exists support_messages_owner_insert on public.support_messages;
create policy support_messages_owner_insert on public.support_messages for insert with check (public.is_admin() or exists (select 1 from public.support_conversations c where c.id = conversation_id and c.profile_id = auth.uid()));

drop policy if exists support_tickets_owner_select on public.support_tickets;
create policy support_tickets_owner_select on public.support_tickets for select using (profile_id = auth.uid() or public.is_admin());
drop policy if exists support_tickets_owner_insert on public.support_tickets;
create policy support_tickets_owner_insert on public.support_tickets for insert with check (profile_id = auth.uid() or public.is_admin());
drop policy if exists support_tickets_owner_update on public.support_tickets;
create policy support_tickets_owner_update on public.support_tickets for update using (profile_id = auth.uid() or public.is_admin()) with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists support_ticket_messages_owner_select on public.support_ticket_messages;
create policy support_ticket_messages_owner_select on public.support_ticket_messages for select using (public.is_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.profile_id = auth.uid()));
drop policy if exists support_ticket_messages_owner_insert on public.support_ticket_messages;
create policy support_ticket_messages_owner_insert on public.support_ticket_messages for insert with check (public.is_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.profile_id = auth.uid()));

-- Webhook event rows are server-only. No anon/authenticated policies are intentional.
comment on table public.support_webhook_events is 'Idempotency and audit log for signed support/payment/provider webhooks; write with service role only.';

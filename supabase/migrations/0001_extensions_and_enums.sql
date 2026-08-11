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

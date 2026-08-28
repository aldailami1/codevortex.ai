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

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

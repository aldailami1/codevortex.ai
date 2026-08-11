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

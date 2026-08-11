-- ==========================================
-- CLOUDFORGE DATABASE INCREMENTAL SCHEMA & DDL
-- Compatible with Supabase / PostgreSQL RLS
-- ==========================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'pro', 'enterprise', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  schema_data JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DEPLOYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  deployment_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  logs TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id OR id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Allow user registration insert" ON public.users;
CREATE POLICY "Allow user registration insert" ON public.users
  FOR INSERT WITH CHECK (true);

-- PROJECTS POLICIES
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
CREATE POLICY "Users can manage their own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- DEPLOYMENTS POLICIES
DROP POLICY IF EXISTS "Users can view deployments for their projects" ON public.deployments;
CREATE POLICY "Users can view deployments for their projects" ON public.deployments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = deployments.project_id
      AND (projects.user_id = auth.uid() OR projects.user_id::text = auth.uid()::text)
    )
  );

-- SUBSCRIPTIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id OR user_id::text = auth.uid()::text);

-- ==========================================
-- SAMPLE SEED DATA FOR DEMO / LOCAL TESTING
-- ==========================================
INSERT INTO public.users (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@cloudforge.io', 'CloudForge Pioneer', 'pro')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.projects (id, user_id, title, description, schema_data, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'CloudForge Core Workstation', 'AI-Native Cloud Automation & Web Engine', '{"entities": [{"name": "Order", "fields": ["id", "customer", "amount", "status"]}]}'::jsonb, 'published')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.deployments (id, project_id, deployment_url, status, logs)
VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'https://cloudforge.app/deploy/proj-1111', 'success', '[BUILD LOG] Container initialized on Port 3000.\n[BUILD LOG] Schema compiled successfully.\n[BUILD LOG] Deployment live!')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subscriptions (id, user_id, plan_type, status)
VALUES
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'pro', 'active')
ON CONFLICT (id) DO NOTHING;

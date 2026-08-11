-- Enterprise Database Migration: 000_schema_init.sql
-- CodeVortex Cloud Infrastructure - Full Enterprise Relational Schema Setup

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS DEFINITION
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'developer', 'enterprise_user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('active', 'building', 'deployed', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_category') THEN
        CREATE TYPE ticket_category AS ENUM ('technical', 'deployment', 'billing', 'security');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');
    END IF;
END $$;

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'developer' NOT NULL,
    verified_status BOOLEAN DEFAULT FALSE NOT NULL,
    otp_code VARCHAR(10),
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. PROJECTS & WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS projects_workspaces (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    status project_status DEFAULT 'active' NOT NULL,
    runtime_port INT DEFAULT 3000 NOT NULL,
    code_files_count INT DEFAULT 1 NOT NULL,
    code_files JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. CHANGELOG & AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    category ticket_category DEFAULT 'technical' NOT NULL,
    message TEXT NOT NULL,
    fax_target VARCHAR(20) DEFAULT '' NOT NULL,
    email_target VARCHAR(255) DEFAULT 'admin@codevortex.com' NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- INDEXES FOR ENTERPRISE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects_workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_email ON support_tickets(user_email);

-- SEED INITIAL DATA
INSERT INTO users (id, name, email, password_hash, role, verified_status, avatar_url, created_at)
VALUES 
    ('usr_admin_001', 'Platform Admin', 'admin@codevortex.com', '$2b$10$e839281938abef...sha256', 'admin', TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', NOW()),
    ('usr_dev_002', 'Senior Cloud Engineer', 'dev@codevortex.io', '$2b$10$99a8b7c6d5e4...sha256', 'developer', TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO support_tickets (id, user_email, subject, category, message, fax_target, email_target, status, created_at)
VALUES 
    ('tkt_8001', 'admin@codevortex.com', 'طلب تخصيص خوادم الدفع والنشر المباشر', 'deployment', 'نود تأكيد تفعيل النشر السحابي التلقائي عبر شهادات SSL المجانية.', '', 'admin@codevortex.com', 'resolved', NOW())
ON CONFLICT (id) DO NOTHING;

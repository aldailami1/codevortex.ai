-- Enterprise Migration: 002_create_projects_workspaces_table.sql
-- Table for managing cloud projects, virtual workspaces, source files, and port runtimes

CREATE TYPE project_status AS ENUM ('active', 'building', 'deployed', 'archived');

CREATE TABLE projects_workspaces (
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

CREATE INDEX idx_projects_owner ON projects_workspaces(owner_id);

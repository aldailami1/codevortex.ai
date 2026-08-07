-- Enterprise Migration: 004_create_support_tickets_table.sql
-- Table for support ticket submissions, technical requests, and direct contact dispatching

CREATE TYPE ticket_category AS ENUM ('technical', 'deployment', 'billing', 'security');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');

CREATE TABLE support_tickets (
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

CREATE INDEX idx_support_tickets_email ON support_tickets(user_email);

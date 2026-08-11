/**
 * CloudForge — API Route Helpers (self-contained)
 * ------------------------------------------------------------------
 * Consistent JSON responses + graceful offline fallbacks so every
 * /api/* endpoint returns useful data even before environment
 * variables (Supabase / Stripe / AI keys) are configured on Vercel.
 */
import { NextResponse } from 'next/server';

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 500, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function isArText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text || '');
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Minimal in-memory ticket store (falls back to deterministic ids). */
export function makeTicket(input: {
  id?: string;
  department: string;
  subject: string;
  message: string;
  senderName?: string;
  senderEmail?: string;
}) {
  const id = input.id || uid('tkt');
  return {
    id,
    magicKey: `CF-${id.toUpperCase().slice(-8)}`,
    department: input.department,
    subject: input.subject,
    message: input.message,
    senderName: input.senderName || 'CloudForge User',
    senderEmail: input.senderEmail || 'user@cloudforge.app',
    status: 'open',
    createdAt: nowIso(),
    replies: [],
  };
}

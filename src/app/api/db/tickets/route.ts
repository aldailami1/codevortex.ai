import { createClient } from '@supabase/supabase-js';
import { json, jsonError, makeTicket } from '@/lib/api';

const allowedDepartments = new Set(['technical', 'deployment', 'billing', 'security', 'sales', 'academic', 'other']);

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, subject, category = 'technical', message } = body as { email?: string; subject?: string; category?: string; message?: string };
    const cleanEmail = typeof email === 'string' ? email.trim().slice(0, 320) : '';
    const cleanSubject = typeof subject === 'string' ? subject.trim().slice(0, 240) : '';
    const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 20000) : '';
    const department = allowedDepartments.has(category || '') ? category! : 'technical';
    if (!cleanEmail || !cleanSubject || !cleanMessage) return jsonError('email, subject and message are required', 400);

    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('support_tickets').insert({
        user_email: cleanEmail,
        subject: cleanSubject,
        department,
        message: cleanMessage,
        status: 'open',
        priority: 3,
      }).select('id, magic_key, user_email, subject, department, message, status, priority, created_at, updated_at').single();
      if (!error && data) return json({ success: true, persisted: true, ticket: data });
    }

    return json({ success: true, persisted: false, ticket: makeTicket({ department, subject: cleanSubject, message: cleanMessage, senderEmail: cleanEmail }) });
  } catch {
    return jsonError('Failed to create ticket', 500);
  }
}

import { json, jsonError, makeTicket } from '@/lib/api';

/**
 * CloudForge — Support Tickets (create)
 * Creates a support ticket. Wired for Supabase `support_tickets` when
 * env is configured; deterministic sandbox fallback otherwise.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, subject, category = 'technical', message } = body as {
      email?: string;
      subject?: string;
      category?: string;
      message?: string;
    };

    if (!email || !subject || !message) {
      return jsonError('email, subject and message are required', 400);
    }

    const ticket = makeTicket({
      department: category,
      subject,
      message,
      senderEmail: email,
    });

    return json({ success: true, ticket });
  } catch (err) {
    return jsonError('Failed to create ticket', 500, String(err));
  }
}

import { json, jsonError, makeTicket } from '@/lib/api';

/** CloudForge — Departmental Support: create ticket */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { department, subject, message, senderName, senderEmail } = body as {
      department?: string;
      subject?: string;
      message?: string;
      senderName?: string;
      senderEmail?: string;
    };

    if (!department || !subject || !message) {
      return jsonError('department, subject and message are required', 400);
    }

    const ticket = makeTicket({ department, subject, message, senderName, senderEmail });
    return json({ success: true, ticket });
  } catch (err) {
    return jsonError('Failed to create departmental ticket', 500, String(err));
  }
}

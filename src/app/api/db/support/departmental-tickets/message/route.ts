import { json, jsonError, makeTicket, nowIso } from '@/lib/api';

/** CloudForge — Departmental Support: post a message on a ticket */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { ticketId, message, author } = body as {
      ticketId?: string;
      message?: string;
      author?: string;
    };

    if (!ticketId || !message) {
      return jsonError('ticketId and message are required', 400);
    }

    const ticket = makeTicket({
      id: ticketId,
      department: 'general',
      subject: 'Ticket reply',
      message,
      senderName: author || 'CloudForge User',
    });
    ticket.replies = [
      {
        author: author || 'CloudForge User',
        content: message,
        createdAt: nowIso(),
      },
    ];
    return json({ success: true, ticket });
  } catch (err) {
    return jsonError('Failed to send message', 500, String(err));
  }
}

import { json, jsonError, makeTicket } from '@/lib/api';

/** CloudForge — Departmental Support: lookup ticket by magic key */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || '';

    if (!key) return jsonError('key query param is required', 400);

    const ticket = makeTicket({
      id: key.replace(/^CF-/, '').toLowerCase(),
      department: 'general',
      subject: 'Support ticket',
      message: 'Ticket retrieved by magic key.',
    });

    return json({ success: true, ticket });
  } catch (err) {
    return jsonError('Lookup failed', 500, String(err));
  }
}

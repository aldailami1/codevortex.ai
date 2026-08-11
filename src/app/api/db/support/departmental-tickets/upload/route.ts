import { json, jsonError, makeTicket } from '@/lib/api';

/**
 * CloudForge — Departmental Support: upload attachment
 * Accepts a base64 payload. In production, stream to Supabase Storage
 * and return the public URL; sandbox returns a data URL echo.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { ticketId, fileName, dataUrl, department = 'general' } = body as {
      ticketId?: string;
      fileName?: string;
      dataUrl?: string;
      department?: string;
    };

    if (!fileName) return jsonError('fileName is required', 400);

    const ticket = makeTicket({
      id: ticketId,
      department,
      subject: 'Attachment upload',
      message: `Attachment: ${fileName}`,
    });

    return json({
      success: true,
      url: dataUrl || `https://cloudforge.app/uploads/${fileName}`,
      ticket,
    });
  } catch (err) {
    return jsonError('Upload failed', 500, String(err));
  }
}

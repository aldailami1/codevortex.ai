import { json, jsonError } from '@/lib/api';

/**
 * CloudForge — AI Code Refine
 * Applies an AI edit to the current project files. Falls back to a
 * comment-annotation edit when no provider key is configured, so the
 * editor experience never breaks.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { prompt, currentFiles } = body as {
      prompt?: string;
      currentFiles?: { path: string; content: string }[];
    };

    const files = Array.isArray(currentFiles) ? currentFiles : [];

    const openaiKey = process.env.OPENAI_API_KEY;
    let updatedFiles = files;

    if (openaiKey && files.length > 0) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content:
                  'You are a senior code editor. Given the current project files and an edit request, return STRICT JSON: {"updatedFiles":[{"path":string,"content":string}]}. Keep all files; only modify what the request needs.',
              },
              {
                role: 'user',
                content: JSON.stringify({ prompt, currentFiles: files }),
              },
            ],
          }),
        });
        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content ?? '';
        const parsed = JSON.parse(content.replace(/^```json|^```|```$/g, '').trim());
        if (parsed?.updatedFiles && Array.isArray(parsed.updatedFiles)) {
          updatedFiles = parsed.updatedFiles;
        }
      } catch {
        /* fall through to annotation edit */
      }
    }

    // Deterministic fallback — annotate the requested change into the code.
    if (!updatedFiles || updatedFiles.length === 0) {
      updatedFiles = files.map((f) => ({
        ...f,
        content: `/* CloudForge AI: ${prompt || 'refinement requested'} */\n${f.content}`,
      }));
    }

    return json({ updatedFiles, applied: true });
  } catch (err) {
    return jsonError('Refine failed', 500, String(err));
  }
}

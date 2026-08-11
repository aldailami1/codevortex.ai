/**
 * CloudForge — Self-Contained Code Formatter
 * ------------------------------------------------------------------
 * A dependency-free formatter used by the CodeEditor and ReplitWorkspace.
 * It runs entirely in the browser bundle — no workers, no remote
 * services, no prettier import — so it can never break on Vercel.
 *
 * Returns the contract the editors expect:
 *   { formatted: string; changed: boolean; error?: string }
 * and it NEVER throws.
 */

const INDENT_UNIT = '  ';

export interface FormatResult {
  formatted: string;
  changed: boolean;
  error?: string;
}

function detectExtension(path: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(path || '');
  return m ? m[1].toLowerCase() : '';
}

function normalizeNewlines(code: string): string {
  return code.replace(/\r\n?/g, '\n');
}

/** Simple structural formatter for JS/TS-like code (braces + brackets). */
function formatJsLike(code: string): string {
  const lines = normalizeNewlines(code).split('\n');
  const out: string[] = [];
  let indent = 0;
  const trimStart = (s: string) => s.replace(/^\s+/, '');

  for (const rawLine of lines) {
    const trimmed = trimStart(rawLine);
    if (!trimmed) {
      out.push('');
      continue;
    }
    // De-indent closing tokens
    if (/^[})\]]/.test(trimmed)) {
      indent = Math.max(0, indent - 1);
    }
    out.push(INDENT_UNIT.repeat(indent) + trimmed);
    // Count opening tokens minus closing tokens on the same line
    const opens = (trimmed.match(/[({[]/g) || []).length;
    const closes = (trimmed.match(/[)}\]]/g) || []).length;
    indent = Math.max(0, indent + opens - closes);
  }
  return out.join('\n');
}

/** Simple formatter for HTML (self-closing-aware, tolerant). */
function formatHtmlLike(code: string): string {
  const normalized = normalizeNewlines(code);
  const tokens = normalized
    .replace(/></g, '>\n<')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const out: string[] = [];
  let indent = 0;
  for (const tok of tokens) {
    const isClosing = /^<\//.test(tok);
    const isSelfClosing = /\/>$/.test(tok) || /^<!/.test(tok) || /^<\?/.test(tok);
    if (isClosing) indent = Math.max(0, indent - 1);
    out.push(INDENT_UNIT.repeat(indent) + tok);
    if (!isClosing && !isSelfClosing && !/^<(br|hr|img|input|meta|link|source|wbr)(\s|>)/i.test(tok)) {
      indent += 1;
    }
  }
  return out.join('\n');
}

/** Simple CSS formatter: one rule per line. */
function formatCssLike(code: string): string {
  const normalized = normalizeNewlines(code);
  const out: string[] = [];
  let indent = 0;
  for (const raw of normalized.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('}')) indent = Math.max(0, indent - 1);
    out.push(INDENT_UNIT.repeat(indent) + line);
    if (line.endsWith('{')) indent += 1;
  }
  return out.join('\n');
}

/** JSON formatter with graceful fallback to the input. */
function formatJson(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return code;
  }
}

function stripTrailingWhitespace(code: string): string {
  return normalizeNewlines(code)
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n');
}

/**
 * Format source code based on its file extension.
 * Always resolves; on any unexpected error it returns the input untouched.
 */
export function formatCode(code: string, path?: string): Promise<FormatResult> {
  return Promise.resolve().then((): FormatResult => {
    if (typeof code !== 'string') {
      return { formatted: '', changed: false, error: 'No code to format' };
    }
    const ext = detectExtension(path || '');
    let formatted = code;
    try {
      switch (ext) {
        case 'json':
          formatted = formatJson(code);
          break;
        case 'html':
        case 'htm':
        case 'jsx':
        case 'tsx':
          formatted = formatHtmlLike(code);
          break;
        case 'css':
        case 'scss':
        case 'less':
          formatted = formatCssLike(code);
          break;
        case 'js':
        case 'ts':
        case 'mjs':
        case 'cjs':
        case 'vue':
          formatted = formatJsLike(code);
          break;
        default:
          // No extension / unknown: best-effort JS-style indentation
          formatted = formatJsLike(code);
      }
      formatted = stripTrailingWhitespace(formatted);
    } catch {
      return { formatted: code, changed: false, error: 'Formatting skipped' };
    }
    return { formatted, changed: formatted !== code };
  });
}

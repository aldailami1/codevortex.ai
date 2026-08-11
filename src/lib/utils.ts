/**
 * CloudForge — Shared Utilities
 * ------------------------------------------------------------------
 * SSR-safe helpers. Components must never touch `localStorage` /
 * `window` during render — Next.js pre-renders on the server, where
 * those globals do not exist.
 */

/** SSR-safe localStorage getter. Returns null on server or on error. */
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** SSR-safe localStorage setter (no-op on server). */
export function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage full / private mode — ignore */
  }
}

/** SSR-safe localStorage remover. */
export function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/**
 * One-time migration from the legacy "CodeVortex" cache keys to the
 * current "CloudForge" keys. Called from the App bootstrap so old
 * visitors never lose their projects and no stale CodeVortex data
 * ever leaks into the CloudForge UI.
 */
export function migrateLegacyCache(): void {
  if (typeof window === 'undefined') return;
  try {
    const MIGRATIONS: Array<[string, string]> = [
      ['codevortex_projects_v1', 'cloudforge_projects_v1'],
      ['codevortex_courses_v5', 'cloudforge_courses_v1'],
      ['codevortex_user_progress_v5', 'cloudforge_user_progress_v1'],
      ['codevortex_user_plan', 'cloudforge_user_plan'],
    ];
    for (const [legacyKey, newKey] of MIGRATIONS) {
      if (!window.localStorage.getItem(newKey)) {
        const legacyValue = window.localStorage.getItem(legacyKey);
        if (legacyValue !== null) {
          window.localStorage.setItem(newKey, legacyValue);
        }
      }
      window.localStorage.removeItem(legacyKey);
    }
  } catch {
    /* ignore */
  }
}

/** Tiny className joiner (Tailwind-friendly). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Simple unique id generator (no external deps). */
export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

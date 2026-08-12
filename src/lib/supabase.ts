/**
 * CloudForge — Supabase Clients (self-contained, SSR-safe)
 */
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function hasSupabaseConfig(): boolean {
  return Boolean(url && anonKey);
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (!browserClient && hasSupabaseConfig()) {
    browserClient = createBrowserClient(url, anonKey);
  }
  return browserClient;
}

export function createSupabaseServerClient(
  request: NextRequest,
  response: NextResponse
) {
  if (!hasSupabaseConfig()) return null;
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });
}

/** Exporting active client or fallback proxy for TypeScript and runtime safety */
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop) {
    const client = createSupabaseBrowserClient();
    if (client) {
      const val = (client as any)[prop];
      return typeof val === 'function' ? val.bind(client) : val;
    }

    // Fallback handlers if env vars are missing during render
    if (prop === 'auth') {
      return {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOAuth: async (options: any) => {
          console.warn('Supabase URL/Key missing in environment variables.');
          return { data: null, error: new Error('Supabase environment variables missing') };
        },
        signOut: () => Promise.resolve({ error: null }),
      };
    }
    return () => Promise.resolve({ data: null, error: null });
  }
});

export default supabase;

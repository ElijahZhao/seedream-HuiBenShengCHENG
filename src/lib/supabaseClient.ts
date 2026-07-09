import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error('Missing env var: ' + name);
  }
  return value;
}

function createSupabaseClient(): SupabaseClient {
  const url = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL');
  const key = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, key);
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

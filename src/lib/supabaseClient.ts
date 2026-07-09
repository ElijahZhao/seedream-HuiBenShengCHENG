/**
 * Supabase 客户端配置
 * 统一入口，所有 Supabase 操作都通过此文件
 * 
 * 使用延迟初始化模式：构建时不会立即创建客户端，
 * 而是在首次访问时创建，避免因环境变量缺失导致构建失败。
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
       +
      
    );
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

// Backward compatibility: export supabase that lazy-initializes on first access
// Note: This may throw at runtime if env vars are missing, but won'''t crash during build
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

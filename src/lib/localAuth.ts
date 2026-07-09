/**
 * 认证模块
 * 现在基于 Supabase Auth，支持跨设备同步
 * 接口保持不变，向下兼容
 */

import { supabase } from './supabaseClient';

const AUTH_KEY = 'seedream_auth';
const DEFAULT_API_KEY = 'ark-1f5b19a3-ea46-432c-8c1e-327e64de67c5-0fab0';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    if (!user.isLoggedIn || !user.id) return null;
    return user;
  } catch {
    return null;
  }
}

export async function clearAuth(): Promise<void> {
  localStorage.removeItem(AUTH_KEY);
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch {
    // signOut 失败不影响本地清除
  }
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

/**
 * 恢复 Supabase session（页面刷新后调用）
 * Supabase 使用 cookie/persistent storage 自动恢复 session，
 * 这里只需同步到 localStorage 即可
 */
export async function restoreSession(): Promise<AuthUser | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;
    if (sessionUser) {
      const authUser: AuthUser = {
        id: sessionUser.id,
        name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || '用户',
        email: sessionUser.email || '',
        isLoggedIn: true,
      };
      setAuthUser(authUser);
      return authUser;
    }
    // Session expired or invalid — clear stale localStorage
    localStorage.removeItem(AUTH_KEY);
    return null;
  } catch {
    return null;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message || '登录失败，请检查邮箱和密码');
  }

  const sessionUser = data.user;
  if (!sessionUser) {
    throw new Error('登录返回数据异常，请重试');
  }

  const authUser: AuthUser = {
    id: sessionUser.id,
    name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || '用户',
    email: sessionUser.email || email,
    isLoggedIn: true,
  };
  setAuthUser(authUser);
  return authUser;
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    const msg = error.message || JSON.stringify(error);
    throw new Error(msg);
  }

  const sessionUser = data.user;
  if (!sessionUser) {
    throw new Error('注册返回数据异常，请重试。如果问题持续，请检查 Supabase 配置。');
  }

  const userId = sessionUser.id;

  // 创建 profile（upsert 避免和触发器冲突）
  try {
    await supabase.from('profiles').upsert({
      id: userId,
      name,
      email,
      created_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch {
    // profile 创建失败不阻塞注册流程（触发器可能已自动创建）
  }

  const authUser: AuthUser = {
    id: userId,
    name,
    email,
    isLoggedIn: true,
  };
  setAuthUser(authUser);
  return authUser;
}

// ========== API Key 管理 ==========

export function getApiKey(): string {
  return localStorage.getItem('seedream_api_key') || DEFAULT_API_KEY;
}

export function setApiKey(key: string): void {
  localStorage.setItem('seedream_api_key', key);
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return key.length > 10;
}

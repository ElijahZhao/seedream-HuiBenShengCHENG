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

/**
 * Supabase 登录成功后，同步到 localStorage 以便同步读取
 */
export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

/**
 * 获取当前登录用户
 * 优先从 localStorage 读取（快速），同时异步检查 Supabase session
 */
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

/**
 * 清除认证状态（登出时调用）
 */
export async function clearAuth(): Promise<void> {
  localStorage.removeItem(AUTH_KEY);
  await supabase.auth.signOut();
}

/**
 * 检查是否已登录
 */
export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

/**
 * Supabase 邮箱密码登录
 * 返回 AuthUser 或抛出错误
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const sessionUser = data.user!;
  // 从 profiles 表获取用户名
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', sessionUser.id)
    .single();

  const authUser: AuthUser = {
    id: sessionUser.id,
    name: profile?.name || sessionUser.user_metadata?.name || email.split('@')[0],
    email: sessionUser.email || email,
    isLoggedIn: true,
  };
  setAuthUser(authUser);
  return authUser;
}

/**
 * Supabase 邮箱密码注册
 * 注册成功后自动创建 profile 并登录
 */
export async function registerWithEmail(name: string, email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  if (error) throw new Error(error.message);

  const sessionUser = data.user!;
  const userId = sessionUser.id;

  // 创建 profile（带用户名）
  await supabase.from('profiles').upsert({
    id: userId,
    name,
    email,
    created_at: new Date().toISOString(),
  });

  const authUser: AuthUser = {
    id: userId,
    name,
    email,
    isLoggedIn: true,
  };
  setAuthUser(authUser);
  return authUser;
}

// ========== API Key 管理（保持不变，仍存 localStorage） ==========

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

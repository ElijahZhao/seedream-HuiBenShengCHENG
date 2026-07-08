/**
 * 本地认证模块
 * 替代原有的 JWT / Cookie 认证，所有数据存 localStorage
 */

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

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

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

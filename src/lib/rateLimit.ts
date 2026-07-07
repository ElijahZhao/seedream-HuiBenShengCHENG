// 简单的内存限流器
// 生产环境建议用 Redis

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

// 每5分钟清理一次过期记录
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store) {
    if (record.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * 检查是否超过限流阈值
 * @param key 限流标识（如 IP + 路由）
 * @param limit 窗口内最大请求数
 * @param windowMs 窗口时长（毫秒）
 * @returns true = 允许通过，false = 被限流
 */
export function checkRateLimit(key: string, limit: number = 10, windowMs: number = 60 * 1000): boolean {
  const now = Date.now();
  const record = store.get(key);

  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * 获取客户端 IP
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  // @ts-expect-error request.socket may not exist in all environments
  return request.socket?.remoteAddress || 'unknown';
}

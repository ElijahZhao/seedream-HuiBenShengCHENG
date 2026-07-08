/**
 * 密码哈希工具
 * 使用浏览器原生 Web Crypto API (SHA-256) 替代 bcryptjs
 * 原因：bcryptjs 在部分浏览器/环境下有兼容性问题，导致登录注册失败
 */

/**
 * 对密码进行 SHA-256 哈希 + 盐值
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const hash = await sha256(password + salt);
  return `${salt}:${hash}`;
}

/**
 * 验证密码是否匹配
 */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  const [salt, originalHash] = hashed.split(':');
  if (!salt || !originalHash) return false;
  const newHash = await sha256(password + salt);
  return newHash === originalHash;
}

/**
 * 生成随机盐值
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // 降级方案
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256 哈希
 */
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

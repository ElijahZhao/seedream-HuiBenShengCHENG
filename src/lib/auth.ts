import crypto from 'crypto';

// JWT 密钥（生产环境应使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// JWT 有效期：30 天
const JWT_EXPIRES_MS = 60 * 60 * 24 * 30 * 1000;

interface JWTPayload {
  userId: string;
  userName: string;
}

function base64UrlEncode(data: string): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(data: string): string {
  const padded = data + '='.repeat((4 - (data.length % 4)) % 4);
  return Buffer.from(padded, 'base64').toString('utf-8');
}

/**
 * 生成 JWT Token
 */
export function signToken(payload: JWTPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor((Date.now() + JWT_EXPIRES_MS) / 1000) })
  );
  const signatureInput = `${header}.${body}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${header}.${body}.${signature}`;
}

/**
 * 验证并解析 JWT Token
 * 返回 payload 或 null（无效/过期）
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const signatureInput = `${header}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(signatureInput)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(base64UrlDecode(body));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) return null;

    return { userId: payload.userId, userName: payload.userName };
  } catch {
    return null;
  }
}

/**
 * 从请求中提取 userId（优先从 token，兼容旧 cookie）
 * 迁移期兼容：如果 token 不存在但 cookie 存在，仍然接受
 */
export function getUserIdFromRequest(request: Request): string | null {
  // 优先从 Authorization header 读 token
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (payload) return payload.userId;
  }

  // 其次从 cookie 读 token
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  if (tokenMatch) {
    const payload = verifyToken(tokenMatch[1]);
    if (payload) return payload.userId;
  }

  // 兼容期：如果旧 cookie 存在，仍然接受
  const userIdMatch = cookieHeader.match(/(?:^|;\s*)userId=([^;]+)/);
  if (userIdMatch) return userIdMatch[1];

  return null;
}

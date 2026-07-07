import { NextRequest, NextResponse } from 'next/server';
import { userManager } from '@/storage/database';
import { compare } from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证必填字段
    if (!email || !password) {
      return NextResponse.json(
        { error: '请填写邮箱和密码' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码不正确' },
        { status: 401 }
      );
    }

    // 检查用户是否激活
    if (!user.isActive) {
      return NextResponse.json(
        { error: '该账户已被禁用' },
        { status: 403 }
      );
    }

    // 验证密码
    if (!user.password) {
      return NextResponse.json(
        { error: '请使用其他登录方式' },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '邮箱或密码不正确' },
        { status: 401 }
      );
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    // 签发 JWT
    const token = signToken({ userId: user.id, userName: user.name });

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    const hostname = request.nextUrl.hostname;
    const isCozeSite = hostname.includes('coze.site');
    const isSecure = process.env.NODE_ENV === 'production' || isCozeSite;
    const maxAge = 60 * 60 * 24 * 30; // 30天

    const cookieOptions: Parameters<typeof response.cookies.set>[2] = {
      httpOnly: true,   // 防止 JS 读取
      secure: isSecure,
      sameSite: isCozeSite ? 'none' : 'lax',
      path: '/',
      maxAge,
    };

    if (isCozeSite) {
      cookieOptions.domain = '.coze.site';
    }

    console.log('[Login API] Setting JWT cookie for:', user.id, user.name);

    response.cookies.set('token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}

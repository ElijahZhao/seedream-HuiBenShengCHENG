import { NextRequest, NextResponse } from 'next/server';
import { userManager } from '@/storage/database';
import { hash } from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();

    // 验证必填字段
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为 6 位' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await userManager.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await hash(password, 10);

    // 创建用户
    const user = await userManager.createUser({
      email,
      name,
      password: hashedPassword,
    });

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
      httpOnly: true,
      secure: isSecure,
      sameSite: isCozeSite ? 'none' : 'lax',
      path: '/',
      maxAge,
    };

    if (isCozeSite) {
      cookieOptions.domain = '.coze.site';
    }

    console.log('[Register API] Setting JWT cookie for:', user.id, user.name);

    response.cookies.set('token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}

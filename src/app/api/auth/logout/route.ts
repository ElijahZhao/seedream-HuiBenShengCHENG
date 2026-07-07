import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
    });

    // 清除 JWT token cookie（兼容旧 cookie）
    response.cookies.delete('token');
    response.cookies.delete('userId');
    response.cookies.delete('userName');

    return response;
  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json(
      { error: '登出失败，请稍后重试' },
      { status: 500 }
    );
  }
}

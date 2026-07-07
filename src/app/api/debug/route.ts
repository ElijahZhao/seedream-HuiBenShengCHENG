import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    const envVars = {
      COZE_WORKLOAD_IDENTITY_API_KEY: process.env.COZE_WORKLOAD_IDENTITY_API_KEY ? 'SET' : 'NOT_SET',
      COZE_INTEGRATION_BASE_URL: process.env.COZE_INTEGRATION_BASE_URL || 'NOT_SET',
      COZE_INTEGRATION_MODEL_BASE_URL: process.env.COZE_INTEGRATION_MODEL_BASE_URL || 'NOT_SET',
      COZE_BUCKET_ENDPOINT_URL: process.env.COZE_BUCKET_ENDPOINT_URL || 'NOT_SET',
      COZE_BUCKET_NAME: process.env.COZE_BUCKET_NAME || 'NOT_SET',
    };

    // 检查请求头
    const headers = Object.fromEntries(request.headers.entries());

    // 检查 cookies
    const cookies = request.cookies.getAll();

    return NextResponse.json({
      success: true,
      environment: envVars,
      requestHeaders: headers,
      cookies: cookies,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

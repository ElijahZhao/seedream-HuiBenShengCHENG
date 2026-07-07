import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    // 创建配置
    const config = new Config();
    console.log('[Test Image] Config:', {
      apiKey: config.apiKey ? 'SET' : 'NOT_SET',
      baseUrl: config.baseUrl,
      modelBaseUrl: config.modelBaseUrl,
    });

    // 使用 verbose 模式来查看详细请求信息
    const client = new ImageGenerationClient(config, undefined, true);

    console.log('[Test Image] Starting image generation...');
    console.log('[Test Image] Environment:', {
      COZE_INTEGRATION_BASE_URL: process.env.COZE_INTEGRATION_BASE_URL,
      COZE_INTEGRATION_MODEL_BASE_URL: process.env.COZE_INTEGRATION_MODEL_BASE_URL,
    });

    // 测试生成一张图片
    const response = await client.generate({
      prompt: '一只可爱的小猫咪，水彩画风格',
      size: '2K',
      watermark: false,
      responseFormat: 'url',
    });

    console.log('[Test Image] Response received');

    const helper = client.getResponseHelper(response);

    if (helper.success) {
      console.log('[Test Image] Success! Image URLs:', helper.imageUrls);
      return NextResponse.json({
        success: true,
        imageUrls: helper.imageUrls,
      });
    } else {
      console.error('[Test Image] Generation failed:', helper.errorMessages);
      return NextResponse.json(
        {
          success: false,
          errors: helper.errorMessages,
          fullResponse: response,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[Test Image] Error:', error);
    if (error instanceof Error) {
      console.error('[Test Image] Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

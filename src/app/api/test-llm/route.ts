import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    // 创建 LLM 客户端
    const config = new Config();
    console.log('[Test LLM] Config:', {
      apiKey: config.apiKey ? 'SET' : 'NOT_SET',
      baseUrl: config.baseUrl,
      modelBaseUrl: config.modelBaseUrl,
    });

    const client = new LLMClient(config);

    // 测试消息
    const messages = [
      { role: 'user' as const, content: 'Hello, please respond with "API is working"' },
    ];

    console.log('[Test LLM] Starting test with model: doubao-seed-2-0-mini-260215');

    const stream = client.stream(messages, {
      model: 'doubao-seed-2-0-mini-260215',
      temperature: 0.7,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      if (chunk.content) {
        const text = chunk.content.toString();
        fullContent += text;
        console.log('[Test LLM] Chunk:', text);
      }
    }

    console.log('[Test LLM] Success! Full content:', fullContent);

    return NextResponse.json({
      success: true,
      content: fullContent,
    });
  } catch (error) {
    console.error('[Test LLM] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

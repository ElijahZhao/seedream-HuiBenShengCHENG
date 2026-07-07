import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config, S3Storage } from 'coze-coding-dev-sdk';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

interface GenerateImagesRequest {
  scenes: Array<{
    id: string;
    description: string;
    shotType: string;
    text: string;
    characters?: string[];
  }>;
  style: string;
  ageGroup: string;
  theme?: string;
  characters?: Array<{
    name: string;
    description: string;
    role: string;
  }>;
}

// 重试配置
const MAX_RETRIES = 2;

export async function POST(request: NextRequest) {
  // 限流：每个 IP 每分钟最多 3 次图片生成请求
  const clientIP = getClientIP(request);
  if (!checkRateLimit(`gen-img:${clientIP}`, 3, 60 * 1000)) {
    return NextResponse.json(
      { error: '图片生成过于频繁，请稍后再试' },
      { status: 429 }
    );
  }

  try {
    const body: GenerateImagesRequest = await request.json();
    const { scenes, style, ageGroup, theme, characters } = body;

    if (!scenes || scenes.length === 0) {
      return NextResponse.json(
        { error: '场景列表不能为空' },
        { status: 400 }
      );
    }

    if (!theme || !theme.trim()) {
      return NextResponse.json(
        { error: '缺少故事主题，无法生成相关图片' },
        { status: 400 }
      );
    }

    if (!characters || characters.length === 0) {
      return NextResponse.json(
        { error: '缺少角色信息，无法生成相关图片' },
        { status: 400 }
      );
    }

    // 初始化图片生成客户端
    const config = new Config();
    const imageClient = new ImageGenerationClient(config);

    // 初始化对象存储
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });

    const { getStylePrompt } = await import('@/lib/styleConfig');
    const stylePrompt = getStylePrompt(style);

    // 构建角色描述字符串
    let characterPrompt = '';
    if (characters && characters.length > 0) {
      characterPrompt = '\n角色设定：\n' + characters.map(char =>
        `- ${char.name}：${char.description}（${char.role}）`
      ).join('\n');
    }

    let themePrompt = theme ? `\n故事主题：${theme}` : '';

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const scenesWithImages: any[] = new Array(scenes.length).fill(null);
          let completedCount = 0;

          // 并行生成所有场景图片
          const generatePromises = scenes.map(async (scene, index) => {
            const prompt = `${stylePrompt}。${themePrompt}${characterPrompt}\n\n场景描述：${scene.description}。适合${ageGroup}岁儿童。高质量插画，细节丰富，保持角色一致性。`;

            let lastError: any = null;

            // 重试机制
            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
              try {
                const response = await imageClient.generate({
                  prompt: prompt,
                  size: '2K',
                  watermark: false,
                  responseFormat: 'url',
                });

                const helper = imageClient.getResponseHelper(response);

                if (!helper.success || !helper.imageUrls || helper.imageUrls.length === 0) {
                  throw new Error('Image generation returned no URLs');
                }

                // 下载图片
                const imageUrl = helper.imageUrls[0];
                const imageResponse = await fetch(imageUrl);
                const imageBuffer = await imageResponse.arrayBuffer();

                // 上传到对象存储
                const fileName = `picturebooks/scenes/${scene.id}_${Date.now()}.png`;
                const fileKey = await storage.uploadFile({
                  fileContent: Buffer.from(imageBuffer),
                  fileName: fileName,
                  contentType: 'image/png',
                });

                // 生成签名URL（30天）
                const signedUrl = await storage.generatePresignedUrl({
                  key: fileKey,
                  expireTime: 86400 * 30,
                });

                scenesWithImages[index] = {
                  ...scene,
                  imageUrl: signedUrl,
                  imageKey: fileKey,
                };

                completedCount++;

                // 发送进度
                const progressData = JSON.stringify({
                  type: 'progress',
                  current: completedCount,
                  total: scenes.length,
                  sceneId: scene.id,
                  message: `场景 ${index + 1} 生成完成`,
                });
                controller.enqueue(encoder.encode(`data: ${progressData}\n\n`));

                // 发送完成信息
                const completeData = JSON.stringify({
                  type: 'scene_complete',
                  sceneId: scene.id,
                  imageUrl: signedUrl,
                });
                controller.enqueue(encoder.encode(`data: ${completeData}\n\n`));

                return; // 成功，跳出重试循环
              } catch (error: any) {
                lastError = error;
                console.error(`[Generate Images] Scene ${index + 1} attempt ${attempt + 1} failed:`, error);
                if (attempt < MAX_RETRIES) {
                  await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // 指数退避
                }
              }
            }

            // 全部重试失败，标记为失败（不塞占位图）
            scenesWithImages[index] = {
              ...scene,
              imageUrl: null,
              error: lastError?.message || '图片生成失败，请重试',
            };

            completedCount++;

            const errorData = JSON.stringify({
              type: 'scene_error',
              sceneId: scene.id,
              error: '图片生成失败，请重试',
            });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          });

          // 等待所有场景生成完成
          await Promise.all(generatePromises);

          // 发送全部完成信息
          const allCompleteData = JSON.stringify({
            type: 'complete',
            scenes: scenesWithImages,
          });
          controller.enqueue(encoder.encode(`data: ${allCompleteData}\n\n`));

          controller.close();
        } catch (error) {
          console.error('图片生成失败:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : '未知错误',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('生成图片失败:', error);
    return NextResponse.json(
      { error: '生成图片失败，请稍后重试' },
      { status: 500 }
    );
  }
}

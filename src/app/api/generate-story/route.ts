import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config } from 'coze-coding-dev-sdk';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

interface GenerateStoryRequest {
  theme: string;
  description: string;
  ageGroup: string;
  style: string;
  pageCount: number;
  language?: 'zh' | 'en';
}

// Prompt 注入基础过滤
function sanitizeInput(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, '')
    .replace(/ignore all instructions/gi, '')
    .replace(/system:|user:|assistant:/gi, '')
    .replace(/```/g, '')
    .slice(0, 2000); // 限制长度
}

// 安全的 JSON 提取函数
function safeExtractJSON(content: string): any | null {
  // 先尝试从 ```json 代码块中提取
  const codeBlockMatch = content.match(/```json\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // 代码块解析失败，继续尝试其他方式
    }
  }

  // 再尝试从 ``` 代码块中提取
  const genericBlockMatch = content.match(/```\s*([\s\S]*?)```/);
  if (genericBlockMatch) {
    try {
      return JSON.parse(genericBlockMatch[1].trim());
    } catch {
      // 继续尝试
    }
  }

  // 最后尝试从第一个 { 到最后一个 } 提取
  const firstBrace = content.indexOf('{');
  const lastBrace = content.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(content.slice(firstBrace, lastBrace + 1));
    } catch {
      // 解析失败
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  // 限流：每个 IP 每分钟最多 5 次生成请求
  const clientIP = getClientIP(request);
  if (!checkRateLimit(`gen-story:${clientIP}`, 5, 60 * 1000)) {
    return NextResponse.json(
      { error: '生成过于频繁，请稍后再试' },
      { status: 429 }
    );
  }

  try {
    const body: GenerateStoryRequest = await request.json();
    let { theme, description, ageGroup, style, pageCount, language } = body;

    // Prompt 注入过滤
    theme = sanitizeInput(theme || '');
    description = sanitizeInput(description || '');

    if (!theme || !description) {
      return NextResponse.json(
        { error: language === 'en' ? 'Story theme and description are required' : '故事主题和描述是必填项' },
        { status: 400 }
      );
    }

    let targetLanguage = language;
    if (!targetLanguage) {
      const chineseRegex = /[\u4e00-\u9fa5]/;
      let chineseCount = 0;
      for (const char of theme) {
        if (chineseRegex.test(char)) chineseCount++;
      }
      targetLanguage = chineseCount > 0 ? 'zh' : 'en';
    }

    const config = new Config();
    const client = new LLMClient(config);

    const { getStyleDescription } = await import('@/lib/styleConfig');
    const styleDesc = getStyleDescription(style, targetLanguage);

    // System Prompt 中明确要求输出 JSON 代码块
    const systemPrompt = targetLanguage === 'en'
      ? `You are a professional children's picture book author and illustrator. Your task is to create a picture book suitable for children aged ${ageGroup} based on the story theme and description provided by the user.

Requirements:
1. Complete story structure, including cover title, character introduction, and ${pageCount} scene storyboards
2. Story content should be simple and easy to understand, appropriate for the target age group's cognitive level
3. Character descriptions should be detailed, including appearance, clothing, expressions, etc., to facilitate consistent character generation in illustrations
4. Each scene includes: shot type, visual description, narration text, and characters present
5. Scene description must be detailed and specific, including environment, characters, actions, expressions, objects, atmosphere, and color tone. Must include character names and specific actions.
6. Shot types include: full shot, medium shot, close-up, extreme close-up
7. Output MUST be wrapped in a JSON code block: \`\`\`json ... \`\`\`

Output format (JSON):
{\n  "title": "Picture book title",\n  "characters": [{"name": "...", "description": "...", "role": "Main character"}],\n  "scenes": [{"id": "scene-1", "shotType": "medium", "description": "...", "text": "...", "characters": ["..."]}]\n}

Art style reference: ${style} - ${styleDesc}`
      : `你是一位专业的儿童绘本作家和插画设计师。你的任务是根据用户提供的故事主题和描述，创作一本适合${ageGroup}岁儿童的绘本。

要求：
1. 故事结构完整，包含封面标题、角色介绍、${pageCount}个场景分镜
2. 故事内容简洁易懂，符合目标年龄的认知水平
3. 角色描述要详细，包含外貌特征、服装、表情等，便于生成插画时保持角色一致性
4. 每个场景包含：景别类型、画面描述、旁白文字、出场角色
5. 场景的 description 必须详细具体，包含环境、角色、动作、表情、物品、氛围和色调，必须包含角色名和具体动作
6. 景别类型包括：全景（full）、中景（medium）、近景（closeup）、特写（extreme closeup）
7. 输出必须放在 JSON 代码块中：\`\`\`json ... \`\`\`

输出格式（JSON）：
{\n  "title": "绘本标题",\n  "characters": [{"name": "...", "description": "...", "role": "主角"}],\n  "scenes": [{"id": "scene-1", "shotType": "medium", "description": "...", "text": "...", "characters": ["..."]}]\n}

艺术风格参考：${style} - ${styleDesc}`;

    const userPrompt = targetLanguage === 'en'
      ? `Story Theme: ${theme}\nStory Description: ${description}\nPlease create picture book content based on the above information. Output in JSON code block format.`
      : `故事主题：${theme}\n故事描述：${description}\n请根据以上信息创作绘本内容。必须以 JSON 代码块格式输出。`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt },
    ];

    console.log('[Generate Story] Starting generation, language:', targetLanguage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const llmStream = client.stream(messages, {
            model: 'doubao-seed-2-0-mini-260215',
            temperature: 0.8,
          });

          let fullContent = '';

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              fullContent += text;
              const data = JSON.stringify({ type: 'content', content: text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          console.log('[Generate Story] Stream completed, parsing JSON...');

          // 使用安全的 JSON 提取
          const storyData = safeExtractJSON(fullContent);

          if (storyData) {
            console.log('[Generate Story] Parsed successfully, scenes:', storyData.scenes?.length || 0);
            const completeData = {
              ...storyData,
              theme,
              description,
              ageGroup,
              style,
              pageCount,
              language: targetLanguage,
            };
            const data = JSON.stringify({ type: 'complete', data: completeData });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          } else {
            // Fallback：返回原始文本，让用户能看到内容
            console.error('[Generate Story] JSON parse failed, returning raw content');
            const data = JSON.stringify({
              type: 'parse_error',
              error: targetLanguage === 'en' ? 'Unable to parse as JSON, returning raw content' : 'JSON 解析失败，返回原始内容',
              rawContent: fullContent,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.close();
        } catch (error) {
          console.error('[Generate Story] Stream error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : (targetLanguage === 'en' ? 'Generation failed' : '生成失败'),
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
    console.error('[Generate Story] API error:', error);
    return NextResponse.json(
      { error: '生成故事失败，请稍后重试', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

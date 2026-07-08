/**
 * 火山方舟 API 封装
 * 直接在前端调用，无需后端中转
 */

import { getApiKey } from '@/lib/localAuth';

const BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

// ========== 故事生成（文字）==========

export async function* generateStoryStream(
  systemPrompt: string,
  userPrompt: string,
  onError?: (err: Error) => void
) {
  const apiKey = getApiKey();

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'doubao-seed-2-0-mini-260215',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API 错误 ${response.status}: ${text}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // 忽略解析失败的行
        }
      }
    }
  } catch (error) {
    if (onError) onError(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

// ========== 图片生成 ==========

export async function generateImage(
  prompt: string,
  options?: {
    size?: string;
    outputFormat?: string;
    watermark?: boolean;
  }
): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(`${BASE_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'doubao-seedream-5-0-260128',
      prompt,
      size: options?.size || '2k',
      output_format: options?.outputFormat || 'png',
      watermark: options?.watermark ?? false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`图片生成失败 ${response.status}: ${text}`);
  }

  const data = await response.json();
  const imageUrl = data.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error('图片生成返回了空 URL');
  }

  return imageUrl;
}

// ========== 搜索故事 ==========

export async function searchStory(theme: string): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'doubao-seed-2-0-mini-260215',
      messages: [
        {
          role: 'system',
          content:
            '你是一位精通中国典故、成语、寓言和传统文化的儿童绘本故事作家。用户的输入可能是一个成语、典故、历史故事名称（如"围魏救赵"、"程门立雪"、"精忠报国"），也可能是一个普通主题（如"小狐狸找月亮"）。\n\n判断规则：\n1. 如果用户的输入是中国成语、典故、寓言或历史故事名称，你必须基于该典故/成语的原本含义和故事情节，改编成一个适合儿童阅读的绘本故事描述（约300-500字）。故事的核心情节必须忠实于原典故，可以用儿童能理解的语言和角色来表达。\n2. 如果用户的输入不是典故/成语（如普通事物、动物、场景），则自由创作一个与之相关的儿童绘本故事描述。\n\n输出要求：直接输出故事描述，不要列出多个选项，不要解释判断过程，不要推荐其他书籍。',
        },
        { role: 'user', content: `请为「${theme}」创作绘本故事描述。如果是典故或成语，请基于原意改编；如果不是，请自由创作。` },
      ],
      stream: false,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`搜索失败 ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

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
            '你是一位专业的儿童绘本故事作家。用户提供一个故事主题，请直接创作一个完整的、适合儿童的绘本故事描述（约300-500字）。描述应包含故事的主要情节、角色和场景，语言生动有趣，适合绘本插画创作。不要列出多个故事标题，也不要推荐其他书籍，直接输出这个故事的完整描述。',
        },
        { role: 'user', content: `请创作一个关于「${theme}」的绘本故事描述` },
      ],
      stream: false,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`搜索失败 ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

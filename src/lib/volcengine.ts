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
    const response = await fetch('/api/volcengine/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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

  const response = await fetch('/api/volcengine/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
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
            '你是一位精通中国典故、成语、寓言和传统文化的儿童绘本故事作家。\n\n规则一（典故/成语/历史故事）：\n如果用户的输入是已有的典故、成语、寓言或历史故事（如"围魏救赵"、"程门立雪"、"精忠报国"、"愚公移山"、"孔融让梨"等），你必须：\n- 严格保留原故事的核心人物姓名、身份和关系\n- 严格保留原故事的核心情节和发展脉络\n- 严格保留原故事的寓意和道理\n- 不要替换人物、不要改变结局、不要删减关键情节\n- 只需要用简单生动的儿童语言重新讲述一遍即可（约300-500字）\n\n规则二（非典故/普通主题）：\n如果用户的输入不是已有的典故或成语（如"小狐狸找月亮"、"勇敢的小兔"等），则自由创作一个与之相关的原创儿童绘本故事描述（约300-500字）。\n\n输出要求：直接输出故事描述正文，不要列出多个选项，不要解释判断过程，不要加标题。',
        },
        { role: 'user', content: `请为「${theme}」创作绘本故事描述。` },
      ],
      stream: false,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`搜索失败 ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

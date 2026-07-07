/**
 * 火山方舟 API 封装
 * 直接在前端调用，无需后端中转
 */

const BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';

function getApiKey(): string {
  const key = localStorage.getItem('seedream_api_key');
  if (!key) throw new Error('请先设置火山方舟 API Key');
  return key;
}

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
            '你是一个专业的儿童故事搜索助手。用户提供一个故事主题，请列出 3-5 个相关的经典童话故事或寓言故事名称，用简短的中文描述。格式为列表，每条一行。',
        },
        { role: 'user', content: `搜索与「${theme}」相关的故事` },
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

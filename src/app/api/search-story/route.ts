import { NextRequest, NextResponse } from 'next/server';
import { SearchClient, Config } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json();

    if (!theme) {
      return NextResponse.json(
        { error: '故事主题不能为空' },
        { status: 400 }
      );
    }

    // 初始化搜索客户端
    const config = new Config();
    const client = new SearchClient(config);

    // 搜索故事相关内容
    const searchQuery = `故事 童话 ${theme} 历史典故`;
    const response = await client.webSearchWithSummary(searchQuery, 5);

    // 如果有AI摘要，直接使用
    if (response.summary) {
      return NextResponse.json({
        success: true,
        description: response.summary,
        source: 'ai_summary',
        results: (response.web_items || []).slice(0, 3).map((item) => ({
          title: item.title || '',
          url: item.url || '',
          snippet: item.snippet || '',
        })),
      });
    }

    // 如果没有摘要，基于搜索结果生成描述
    if (response.web_items && response.web_items.length > 0) {
      // 选择最相关的结果
      const topResults = response.web_items.slice(0, 3);
      const description = topResults
        .map((item, index) => {
          const title = item.title || '无标题';
          const snippet = item.snippet || '无描述';
          return `${index + 1}. ${title}\n${snippet}`;
        })
        .join('\n\n');

      return NextResponse.json({
        success: true,
        description: description,
        source: 'search_results',
        results: topResults.map((item) => ({
          title: item.title || '',
          url: item.url || '',
          snippet: item.snippet || '',
        })),
      });
    }

    // 如果搜索无结果，返回建议让用户自己编写
    return NextResponse.json({
      success: false,
      description: '',
      source: 'none',
      message: '未找到相关故事内容，请您自己编写故事吧！',
    });
  } catch (error) {
    console.error('搜索故事失败:', error);
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';
import axios from 'fs';

// 定义 6 种风格的生成提示词
const stylePrompts = [
  {
    style: 'watercolor',
    label: '水彩风',
    prompt: '儿童绘本插画，水彩风格，可爱的小兔子在花园里玩耍，柔和的色调，温暖梦幻，艺术感强'
  },
  {
    style: 'anime',
    label: '动漫风',
    prompt: '儿童绘本插画，日式动漫风格，可爱的小女孩和她的猫咪朋友，色彩鲜艳，活泼生动'
  },
  {
    style: 'clay',
    label: '黏土风',
    prompt: '儿童绘本插画，3D 黏土风格，立体感强，可爱的小熊在森林里野餐，温暖柔和'
  },
  {
    style: 'sketch',
    label: '素描风',
    prompt: '儿童绘本插画，铅笔素描风格，小男孩在树下看书，线条简洁，艺术感强'
  },
  {
    style: 'pastel',
    label: '粉彩风',
    prompt: '儿童绘本插画，柔和粉彩风格，温柔治愈，小天使在云端玩耍，梦幻唯美的感觉'
  },
  {
    style: 'pop',
    label: '波普风',
    prompt: '儿童绘本插画，波普艺术风格，鲜艳的色彩，活力四射，几何图案，现代感强'
  }
];

// 生成单个风格的图片
async function generateStyleImage(style: string, prompt: string) {
  const config = new Config();
  const client = new ImageGenerationClient(config);

  try {
    const response = await client.generate({
      prompt: prompt,
      size: '2K',
      watermark: false,
      responseFormat: 'url'
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      return {
        style,
        imageUrl: helper.imageUrls[0],
        success: true
      };
    } else {
      return {
        style,
        error: helper.errorMessages.join(', '),
        success: false
      };
    }
  } catch (error: any) {
    return {
      style,
      error: error.message || '生成失败',
      success: false
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // 检查是否指定了特定风格
    const searchParams = request.nextUrl.searchParams;
    const specificStyle = searchParams.get('style');

    let stylesToGenerate = stylePrompts;
    if (specificStyle) {
      stylesToGenerate = stylePrompts.filter(s => s.style === specificStyle);
    }

    // 并发生成所有图片
    const results = await Promise.all(
      stylesToGenerate.map(style =>
        generateStyleImage(style.style, style.prompt)
      )
    );

    // 过滤成功的生成结果
    const successResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);

    if (failedResults.length > 0) {
      console.error('部分图片生成失败:', failedResults);
    }

    // 如果指定了单个风格且失败，返回错误
    if (specificStyle && failedResults.length > 0) {
      return NextResponse.json(
        {
          error: failedResults[0].error,
          style: specificStyle
        },
        { status: 500 }
      );
    }

    // 返回生成的图片 URL 列表
    return NextResponse.json({
      success: true,
      images: successResults.map(r => ({
        style: r.style,
        imageUrl: (r as any).imageUrl
      })),
      failed: failedResults.map(r => ({
        style: r.style,
        error: r.error
      }))
    });

  } catch (error: any) {
    console.error('生成风格图片时出错:', error);
    return NextResponse.json(
      {
        error: error.message || '服务器内部错误',
        success: false
      },
      { status: 500 }
    );
  }
}

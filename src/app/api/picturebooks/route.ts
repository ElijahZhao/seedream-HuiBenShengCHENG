import { NextRequest, NextResponse } from 'next/server';
import { picturebookManager } from '@/storage/database';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = parseInt(searchParams.get('skip') || '0');

    const userId = getUserIdFromRequest(request);

    let picturebooks: any[] = [];

    if (userId) {
      picturebooks = await picturebookManager.getPicturebooks({
        filters: { userId },
        limit,
        skip,
      }) || [];
    } else {
      // 未登录用户返回公开绘本
      picturebooks = await picturebookManager.getPublishedPicturebooks(limit) || [];
    }

    return NextResponse.json({
      success: true,
      picturebooks,
    });
  } catch (error) {
    console.error('获取绘本列表失败:', error);
    return NextResponse.json(
      { error: '获取绘本列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, theme, description, ageGroup, style, pageCount, storyData, coverImage } = body;

    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!theme) missingFields.push('theme');
    if (!description) missingFields.push('description');
    if (!ageGroup) missingFields.push('ageGroup');
    if (!style) missingFields.push('style');
    if (!pageCount) missingFields.push('pageCount');
    if (!storyData) missingFields.push('storyData');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必填字段: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const picturebook = await picturebookManager.createPicturebook({
      userId,
      title,
      theme,
      description,
      ageGroup,
      style,
      pageCount,
      storyData,
      coverImage,
      isPublished: false,
      viewCount: 0,
    });

    return NextResponse.json({
      success: true,
      picturebook,
    });
  } catch (error) {
    console.error('保存绘本失败:', error);
    return NextResponse.json(
      { error: '保存绘本失败，请稍后重试' },
      { status: 500 }
    );
  }
}

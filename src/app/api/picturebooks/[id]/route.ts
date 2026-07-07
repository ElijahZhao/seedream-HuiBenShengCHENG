import { NextRequest, NextResponse } from 'next/server';
import { picturebookManager } from '@/storage/database';
import { getUserIdFromRequest } from '@/lib/auth';
import { refreshImageUrls } from '@/lib/refreshImageUrls';

// GET 获取单个绘本详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const picturebook = await picturebookManager.getPicturebookById(id);

    if (!picturebook) {
      return NextResponse.json(
        { error: '绘本不存在' },
        { status: 404 }
      );
    }

    // 刷新过期的签名URL（解决图片7天后失效问题）
    const storyData = picturebook.storyData as any;
    if (storyData && Array.isArray(storyData.scenes)) {
      picturebook.storyData = await refreshImageUrls(storyData);
    }

    return NextResponse.json({
      success: true,
      picturebook,
    });
  } catch (error) {
    console.error('获取绘本详情失败:', error);
    return NextResponse.json(
      { error: '获取绘本详情失败' },
      { status: 500 }
    );
  }
}

// PATCH 更新绘本
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const picturebook = await picturebookManager.getPicturebookById(id);
    if (!picturebook) {
      return NextResponse.json(
        { error: '绘本不存在' },
        { status: 404 }
      );
    }

    if (picturebook.userId !== userId) {
      return NextResponse.json(
        { error: '无权修改该绘本' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await picturebookManager.updatePicturebook(id, body);

    return NextResponse.json({
      success: true,
      picturebook: updated,
    });
  } catch (error) {
    console.error('更新绘本失败:', error);
    return NextResponse.json(
      { error: '更新绘本失败' },
      { status: 500 }
    );
  }
}

// DELETE 删除绘本
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const picturebook = await picturebookManager.getPicturebookById(id);
    if (!picturebook) {
      return NextResponse.json(
        { error: '绘本不存在' },
        { status: 404 }
      );
    }

    if (picturebook.userId !== userId) {
      return NextResponse.json(
        { error: '无权删除该绘本' },
        { status: 403 }
      );
    }

    await picturebookManager.deletePicturebook(id);

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    console.error('删除绘本失败:', error);
    return NextResponse.json(
      { error: '删除绘本失败' },
      { status: 500 }
    );
  }
}

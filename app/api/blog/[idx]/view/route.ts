import { NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';

const blogService = new BlogService();

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const { idx } = await params;
    const blogIdx = Number(idx);

    if (!idx || Number.isNaN(blogIdx)) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const result = await blogService.incrementBlogViewCount(blogIdx);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '블로그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Increase blog view count error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

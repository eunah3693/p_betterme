import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';

const blogService = new BlogService();

export async function GET(req: NextRequest) {
  try {
    const minViewCount = Number(req.nextUrl.searchParams.get('minViewCount') ?? 10);
    const result = await blogService.getBlogsByMinViewCount(minViewCount);

    return NextResponse.json({
      success: result.success,
      data: result.data,
    });
  } catch (error) {
    console.error('Get static blog params error:', error);
    return NextResponse.json(
      { success: false, data: [], error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

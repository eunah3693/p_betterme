import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';

const blogService = new BlogService();

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    const body = await req.json();
    
    const { page = 0, categoryIdx = null } = body;

    const result = await blogService.getMyBlogs(id as string, { page, categoryIdx });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: '블로그 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '블로그 목록 조회 성공',
      data: result.data,
      page: result.page,
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

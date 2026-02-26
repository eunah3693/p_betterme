import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';

const blogService = new BlogService();

export async function GET(req: NextRequest) {
  try {
    const result = await blogService.getAllBlogs();
    
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
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

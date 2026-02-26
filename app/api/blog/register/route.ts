import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';

const blogService = new BlogService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, subject, content, date } = body;

    if (!memberId || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'memberId, subject, content는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.registerBlog({
      memberId,
      subject,
      content,
      date: date ? new Date(date) : new Date()
    });

    return NextResponse.json({
      success: true,
      message: '블로그가 등록되었습니다.',
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('Register blog error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

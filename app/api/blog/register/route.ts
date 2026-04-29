import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const blogService = new BlogService();

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUserFromCookies();
    const body = await req.json();
    const { subject, content, date, categoryIdx } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: 'subject, content는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.registerBlog({
      memberId: user.id,
      subject,
      content,
      date: date ? new Date(date) : new Date(),
      categoryIdx: categoryIdx != null ? Number(categoryIdx) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: '블로그가 등록되었습니다.',
      data: result,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Register blog error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

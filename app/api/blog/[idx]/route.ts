import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { UnauthorizedError } from '@/lib/errors';

const blogService = new BlogService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const { idx } = await params;

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    let userId = '';
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (token?.value) {
      const user = verifyToken(token.value);
      if (user) userId = user.id;
    }

    const result = await blogService.getBlogByIdx({ idx: Number(idx), id: userId });

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
    console.error('Get blog error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const user = await requireAuthUserFromCookies();
    const { idx } = await params;
    const body = await req.json();

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const updateData = {
      ...body,
      idx: Number(idx),
      memberId: user.id
    };

    const result = await blogService.updateBlog(updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '블로그 수정에 실패했습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Update blog error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const user = await requireAuthUserFromCookies();
    const { idx } = await params;

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const result = await blogService.deleteBlog(Number(idx), user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '블로그 삭제에 실패했습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Delete blog error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

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
    const { idx } = await params;
    const body = await req.json();

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const updateData = {
      ...body,
      idx: Number(idx) 
    };

    const result = await blogService.updateBlog(updateData);

    return NextResponse.json({
      success: true,
      message: '블로그가 수정되었습니다.',
      data: result,
    });
  } catch (error) {
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
    const { idx } = await params;

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    await blogService.deleteBlog(Number(idx));

    return NextResponse.json({
      success: true,
      message: '블로그가 삭제되었습니다.',
      data: null,
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

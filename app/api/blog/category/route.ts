import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const blogService = new BlogService();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: 'memberId는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.getCategoriesByMemberId(memberId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUserFromCookies();
    const body = await req.json();
    const { categoryName, order } = body;

    if (!categoryName) {
      return NextResponse.json(
        { success: false, error: 'categoryName은 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.registerCategory({
      memberId: user.id,
      categoryName,
      order: order || 0
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Register category error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuthUserFromCookies();
    const body = await req.json();
    const { idx, categoryName, order } = body;

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.updateCategoryByMemberId(user.id, {
      idx: Number(idx),
      categoryName,
      order
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '카테고리 수정에 실패했습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuthUserFromCookies();
    const searchParams = req.nextUrl.searchParams;
    const idx = searchParams.get('idx');

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.deleteCategoryByMemberId(Number(idx), user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '카테고리 삭제에 실패했습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

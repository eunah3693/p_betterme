import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/services/blogService';

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
    const body = await req.json();
    const { memberId, categoryName, order } = body;

    if (!memberId || !categoryName) {
      return NextResponse.json(
        { success: false, error: 'memberId와 categoryName은 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.registerCategory({
      memberId,
      categoryName,
      order: order || 0
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Register category error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { idx, categoryName, order } = body;

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.updateCategory({
      idx: Number(idx),
      categoryName,
      order
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const idx = searchParams.get('idx');

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await blogService.deleteCategory(Number(idx));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

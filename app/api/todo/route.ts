import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '@/services/todoService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const todoService = new TodoService();

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUserFromCookies();
    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'startDate, endDate는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await todoService.viewTodo({ memberId: user.id, startDate, endDate });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Todo 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Todo 목록 조회 성공',
      data: result.data,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Get todos error:', error);
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
    const { subject, content, finish, startDate, finishDate } = body;

    if (!subject || !startDate || !finishDate) {
      return NextResponse.json(
        { success: false, error: 'subject, startDate, finishDate는 필수입니다' },
        { status: 400 }
      );
    }

    const result = await todoService.createTodo({
      memberId: user.id,
      subject,
      content,
      finish: finish || '0',
      startDate,
      finishDate
    });

    return NextResponse.json({
      success: true,
      message: 'Todo가 등록되었습니다.',
      data: result,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Create todo error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

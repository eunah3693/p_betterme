import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '@/services/todoService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const todoService = new TodoService();

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

    const { subject, content, finish, startDate, finishDate } = body;

    const updateData: {
      subject?: string;
      content?: string;
      finish?: string;
      startDate?: string;
      finishDate?: string;
    } = {};

    if (subject) updateData.subject = subject;
    if (content) updateData.content = content;
    if (finish) updateData.finish = finish;
    if (startDate) updateData.startDate = startDate;
    if (finishDate) updateData.finishDate = finishDate;

    const result = await todoService.updateTodo(Number(idx), user.id, updateData);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Todo를 찾을 수 없거나 수정 권한이 없습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Todo가 수정되었습니다.',
      data: result,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Update todo error:', error);
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

    const deleted = await todoService.deleteTodo(Number(idx), user.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Todo를 찾을 수 없거나 삭제 권한이 없습니다.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Todo가 삭제되었습니다.',
      data: null,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Delete todo error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

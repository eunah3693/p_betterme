import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '@/services/todoService';

const todoService = new TodoService();

export async function PUT(
  req: NextRequest,
  { params }: { params: { idx: string } }
) {
  try {
    const idx = params.idx;
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
      startDate?: Date;
      finishDate?: Date;
    } = {};

    if (subject) updateData.subject = subject;
    if (content) updateData.content = content;
    if (finish) updateData.finish = finish;
    if (startDate) updateData.startDate = new Date(startDate);
    if (finishDate) updateData.finishDate = new Date(finishDate);

    const result = await todoService.updateTodo(Number(idx), updateData);

    return NextResponse.json({
      success: true,
      message: 'Todo가 수정되었습니다.',
      data: result,
    });
  } catch (error) {
    console.error('Update todo error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { idx: string } }
) {
  try {
    const idx = params.idx;

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    await todoService.deleteTodo(Number(idx));

    return NextResponse.json({
      success: true,
      message: 'Todo가 삭제되었습니다.',
      data: null,
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

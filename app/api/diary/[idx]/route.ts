import { NextRequest, NextResponse } from 'next/server';
import { DiaryService } from '@/services/diaryService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const diaryService = new DiaryService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const { idx } = await params;
    const user = await requireAuthUserFromCookies();

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const result = await diaryService.getDiaryByIdx(Number(idx), user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '일기를 찾을 수 없습니다.' },
        { status: 404 }
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

    console.error('Get diary error:', error);
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
    const user = await requireAuthUserFromCookies();
    const body = await req.json();

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const { subject, content, date } = body;

    const updateData = {
      idx: Number(idx),
      memberId: user.id,
      subject: subject,
      content: content,
      date: new Date(date)
    };

    const result = await diaryService.updateDiary(updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '일기 수정에 실패했습니다.' },
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

    console.error('Update diary error:', error);
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
    const user = await requireAuthUserFromCookies();

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const result = await diaryService.deleteDiary(Number(idx), user.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '일기 삭제에 실패했습니다.' },
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

    console.error('Delete diary error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

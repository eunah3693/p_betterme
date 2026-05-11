import { NextRequest, NextResponse } from 'next/server';
import { DiaryService } from '@/services/diaryService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const diaryService = new DiaryService();

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUserFromCookies();

    const pageParam = req.nextUrl.searchParams.get('page');
    const page = Number(pageParam ?? 0);

    const result = await diaryService.getDiaries(user.id, {
      page: Number.isNaN(page) || page < 0 ? 0 : page,
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: '일기 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '일기 목록 조회 성공',
      data: result.data,
      page: result.page,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Get diaries error:', error);
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
    const { subject, content, date } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 일기를 적어주세요' },
        { status: 400 }
      );
    }

    const result = await diaryService.registerDiary({
      memberId: user.id,
      subject,
      content,
      date: date ? new Date(date) : new Date()
    });

    return NextResponse.json({
      success: true,
      message: '일기가 등록되었습니다.',
      data: result,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Register diary error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

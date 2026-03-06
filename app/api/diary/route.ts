import { NextRequest, NextResponse } from 'next/server';
import { DiaryService } from '@/services/diaryService';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const diaryService = new DiaryService();

export async function GET() {
  try {
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

    const result = await diaryService.getAllDiaries(user.id);
    
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
    });
  } catch (error) {
    console.error('Get diaries error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
    console.error('Register diary error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

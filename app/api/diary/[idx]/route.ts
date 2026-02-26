import { NextRequest, NextResponse } from 'next/server';
import { DiaryService } from '@/services/diaryService';
import { authenticateRequest } from '@/lib/api';
import { cookies } from 'next/headers';

const diaryService = new DiaryService();

export async function GET(
  req: NextRequest,
  { params }: { params: { idx: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = authenticateRequest(req);
    const idx = params.idx;

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
    console.error('Get diary error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { idx: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = authenticateRequest(req);
    const idx = params.idx;
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
    console.error('Update diary error:', error);
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
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = authenticateRequest(req);
    const idx = params.idx;

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
    console.error('Delete diary error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

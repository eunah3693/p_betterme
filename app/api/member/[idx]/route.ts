import { NextRequest, NextResponse } from 'next/server';
import { MemberService } from '@/services/memberService';

const memberService = new MemberService();

export async function GET(
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

    const result = await memberService.getMemberByIdx(Number(idx));

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '회원 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Get member error:', error);
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
    const idx = params.idx;
    const body = await req.json();

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const { job, jobInfo, myBadge } = body;

    const result = await memberService.updateMemberInfo({ 
      idx: Number(idx), 
      job, 
      jobInfo, 
      myBadge 
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '회원 정보 수정에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

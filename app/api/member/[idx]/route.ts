import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MemberService } from '@/services/memberService';

const memberService = new MemberService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const { idx } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const result = await memberService.getMemberByIdx(Number(idx), token?.value || '');

    if (!result.success) {
      const status =
        result.message === '인증이 필요합니다.' || result.message === '유효하지 않은 토큰입니다.'
          ? 401
          : result.message === '본인 정보만 조회/수정할 수 있습니다.'
            ? 403
            : 404;

      return NextResponse.json(
        { success: false, error: result.message || '회원 정보를 찾을 수 없습니다.' },
        { status }
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
  { params }: { params: Promise<{ idx: string }> }
) {
  try {
    const { idx } = await params;
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

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
    }, token?.value || '');

    if (!result.success) {
      const status =
        result.message === '인증이 필요합니다.' || result.message === '유효하지 않은 토큰입니다.'
          ? 401
          : result.message === '본인 정보만 조회/수정할 수 있습니다.' ||
              result.message === '회원 정보를 찾을 수 없거나 수정 권한이 없습니다.'
            ? 403
            : 400;

      return NextResponse.json(
        { success: false, error: result.message || '회원 정보 수정에 실패했습니다.' },
        { status }
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

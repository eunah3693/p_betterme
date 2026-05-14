import { NextResponse } from 'next/server';
import { MemberService } from '@/services/memberService';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const memberService = new MemberService();

export async function GET() {
  try {
    const user = await requireAuthUserFromCookies();
    const result = await memberService.getMemberByIdx(user.idx, user);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Get current member error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

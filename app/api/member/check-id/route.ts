import { NextRequest, NextResponse } from 'next/server';
import { MemberService } from '@/services/memberService';
import { checkIdSchema } from '@/lib/validation';

const memberService = new MemberService();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // 유효성 검사
    const validation = checkIdSchema.safeParse({ id });
    // 유효성 검사 실패 시 400 에러 반환
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // 아이디 중복 체크
    const result = await memberService.checkId(validation.data.id);
    // 아이디 중복 체크 실패 시 400 에러 반환
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '아이디 중복 체크에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error('Check ID error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

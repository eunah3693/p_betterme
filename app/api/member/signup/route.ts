import { NextRequest, NextResponse } from 'next/server';
import { MemberService } from '@/services/memberService';
import { signupSchema } from '@/lib/validation';

const memberService = new MemberService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 유효성 검사
    const validation = signupSchema.safeParse(body);
    // 유효성 검사 실패 시 400 에러 반환
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // 회원가입
    const result = await memberService.signup({
      ...validation.data,
      job: validation.data.job || '',
      jobInfo: validation.data.jobInfo || '',
      myBadge: validation.data.myBadge || '',
    });

    // 회원가입 실패 시 400 에러 반환
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '회원가입에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

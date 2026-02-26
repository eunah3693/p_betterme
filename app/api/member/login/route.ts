import { NextRequest, NextResponse } from 'next/server';
import { MemberService } from '@/services/memberService';
import { loginSchema } from '@/lib/validation';

const memberService = new MemberService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const validation = loginSchema.safeParse(body);
    
    // 유효성 검사 실패 시 400 에러 반환
    if (!validation.success) {
      const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const result = await memberService.login(validation.data);

    // 로그인 실패 시 401 에러 반환
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || '로그인에 실패했습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰을 httpOnly Cookie에 설정
    const response = NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });

    if (result.token) {
      response.cookies.set('token', result.token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'strict',
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

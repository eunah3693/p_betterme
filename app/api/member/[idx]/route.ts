import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { MemberService } from '@/services/memberService';
import { timingSafeEqual } from 'crypto';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';

const memberService = new MemberService();
const CSRF_COOKIE_NAME = 'csrfToken';

const isSameToken = (tokenA?: string, tokenB?: string) => {
  if (!tokenA || !tokenB) {
    return false;
  }

  const bufferA = Buffer.from(tokenA);
  const bufferB = Buffer.from(tokenB);

  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
};

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

    const result = await memberService.getMemberByIdx(Number(idx), user);

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

    const response = NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
      csrfToken: result.csrfToken,
    });

    if (result.csrfToken) {
      response.cookies.set(CSRF_COOKIE_NAME, result.csrfToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 30,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

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
    const user = await requireAuthUserFromCookies();
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get(CSRF_COOKIE_NAME);

    if (!idx) {
      return NextResponse.json(
        { success: false, error: 'idx is required' },
        { status: 400 }
      );
    }

    const requestCsrfToken =
      typeof body.csrfToken === 'string'
        ? body.csrfToken
        : req.headers.get('x-csrf-token') || undefined;

    if (!isSameToken(requestCsrfToken, csrfToken?.value)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 CSRF 토큰입니다.' },
        { status: 403 }
      );
    }

    const { job, jobInfo, myBadge } = body;

    const result = await memberService.updateMemberInfo(
      {
        idx: Number(idx),
        job,
        jobInfo,
        myBadge,
        csrfToken: requestCsrfToken,
      },
      user,
    );

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
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }

    console.error('Update member error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

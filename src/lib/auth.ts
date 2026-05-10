import { GetServerSidePropsContext } from 'next';
import { cookies } from 'next/headers';
import { verifyToken, JwtPayload } from '@/lib/jwt';
import { UnauthorizedError } from '@/lib/errors';

// 서버에서 헤더 쿠키가져오기
export const getCookieFromContext = (context: GetServerSidePropsContext, name: string): string | null => {
  const cookies = context.req.headers.cookie;
  if (!cookies) return null;

  const cookie = cookies.split(';').find(c => c.trim().startsWith(`${name}=`));
  if (!cookie) return null;

  return cookie.split('=')[1];
};

// 인증확인
export const requireAuth = (context: GetServerSidePropsContext): JwtPayload | null => {
  const token = getCookieFromContext(context, 'token');
  
  if (!token) {
    return null;
  }

  // 토큰 검증
  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }

  return payload;
};

// App Router에서 쿠키 기반 인증 사용자 조회
export const requireAuthUserFromCookies = async (): Promise<JwtPayload> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token?.value) {
    throw new UnauthorizedError('인증이 필요합니다.');
  }

  const payload = verifyToken(token.value);
  if (!payload) {
    throw new UnauthorizedError('유효하지 않은 토큰입니다.');
  }

  return payload;
};


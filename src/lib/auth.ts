'use server';

import { GetServerSidePropsContext } from 'next';
import { verifyToken, JwtPayload } from '@/lib/jwt';

// 서버에서 헤어 쿠키가져오기기
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

// 인증실패시 로그인페이지로
export const redirectToLogin = () => ({
  redirect: {
    destination: '/login',
    permanent: false,
  },
});

// 인증성공시 홈페이지로
export const redirectToHome = () => ({
  redirect: {
    destination: '/',
    permanent: false,
  },
});


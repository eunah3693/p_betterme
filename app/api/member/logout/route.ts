import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: '로그아웃되었습니다.',
  });

  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  response.cookies.set('csrfToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

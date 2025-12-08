import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { LoginResponse } from '@/interfaces/member';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';
import { loginSchema } from '@/lib/validation';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const validation = loginSchema.safeParse(req.body);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
    return createErrorResponse(res, 400, errorMessage);
  }

  const result = await memberService.login(validation.data);

  if (!result.success) {
    return createErrorResponse(res, 401, result.message || '로그인에 실패했습니다.');
  }

  // JWT 토큰을 httpOnly Cookie에 설정
  if (result.token) {
    res.setHeader('Set-Cookie', [
      `token=${result.token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`,
    ]);
  }

  return createSuccessResponse(res, result.data, result.message);
}

export default withErrorHandler(handler);


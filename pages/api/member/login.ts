import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { LoginResponse } from '@/interfaces/member';
import { withErrorHandler } from '@/lib/api';
import { loginSchema } from '@/lib/validation';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Zod로 유효성 검사
  const validation = loginSchema.safeParse(req.body);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
    return res.status(400).json({
      success: false,
      data: null,
      message: errorMessage
    });
  }

  const result = await memberService.login(validation.data);

  // JWT 토큰을 httpOnly Cookie에 설정
  if (result.token) {
    res.setHeader('Set-Cookie', [
      `token=${result.token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`,
    ]);
  }

  return res.status(200).json(result);
}

export default withErrorHandler(handler);


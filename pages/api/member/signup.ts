import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { MemberResponse } from '@/interfaces/member';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';
import { signupSchema } from '@/lib/validation';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  // 유효성 검사
  const validation = signupSchema.safeParse(req.body);
  // 유효성 검사 실패 시  400 에러 반환
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
    return createErrorResponse(res, 400, errorMessage);
  }

  // 회원가입
  const result = await memberService.signup({
    ...validation.data,
    job: validation.data.job || '',
    jobInfo: validation.data.jobInfo || '',
    myBadge: validation.data.myBadge || '',
  });

  // 회원가입 실패 시  400 에러 반환
  if (!result.success) {
    return createErrorResponse(res, 400, result.message || '회원가입에 실패했습니다.');
  }

  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data,
  });
}

export default withErrorHandler(handler);


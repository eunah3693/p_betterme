import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { CheckIdResponse } from '@/interfaces/member';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';
import { checkIdSchema } from '@/lib/validation';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckIdResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  // 유효성 검사
  const validation = checkIdSchema.safeParse(req.query);
  // 유효성 검사 실패 시  400 에러 반환
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
    return createErrorResponse(res, 400, errorMessage);
  }

  // 아이디 중복 체크
  const result = await memberService.checkId(validation.data.id);
  // 아이디 중복 체크 실패 시  400 에러 반환
  if (!result.success) {
    return createErrorResponse(res, 400, result.message || '아이디 중복 체크에 실패했습니다.');
  }

  return createSuccessResponse(res, result, result.message);
}

export default withErrorHandler(handler);


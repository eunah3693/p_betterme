import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { MemberResponse } from '@/interfaces/member';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse | { error: string }>
) {
  if (req.method !== 'PUT') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  const { job, jobInfo, myBadge } = req.body;

  const result = await memberService.updateMemberInfo( { idx: Number(idx), job, jobInfo, myBadge } );

  if (!result.success) {
    return createErrorResponse(res, 400, result.message || '회원 정보 수정에 실패했습니다.');
  }

  return createSuccessResponse(res, result.data, result.message);
}

export default withErrorHandler(handler);

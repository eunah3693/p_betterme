import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { MemberResponse } from '@/interfaces/member';
import { withErrorHandler, createSuccessResponse } from '@/lib/api';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse | { error: string }>
) {
  const { idx } = req.query;

  if (!idx) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'idx is required'
    });
  }

  switch (req.method) {
    case 'GET':
      return await getMemberInfo(req, res, Number(idx));
    case 'PUT':
      return await updateMemberInfo(req, res, Number(idx));
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// 회원 정보 조회
async function getMemberInfo(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse>,
  idx: number
) {
  const result = await memberService.getMemberByIdx(idx);

  if (!result.success) {
    return res.status(404).json(result);
  }

  return createSuccessResponse(res, result.data, result.message);
}

// 회원 정보 수정
async function updateMemberInfo(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse>,
  idx: number
) {
  const { job, jobInfo, myBadge } = req.body;

  const result = await memberService.updateMemberInfo(idx, { job, jobInfo, myBadge });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return createSuccessResponse(res, result.data, result.message);
}

export default withErrorHandler(handler);


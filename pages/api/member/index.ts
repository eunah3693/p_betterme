import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { MemberResponse, CheckIdResponse } from '@/interfaces/member';
import { withErrorHandler, validateMethod, createErrorResponse, createSuccessResponse } from '@/lib/api';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse | CheckIdResponse | { error: string }>
) {
  if (!validateMethod(req, ['GET', 'POST', 'PUT'])) {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  switch (req.method) {
    case 'GET':
      // query에 idx가 있으면 회원 정보 조회, 없으면 ID 중복 체크
      const { idx } = req.query;
      if (idx) {
        return await getMemberInfo(req, res);
      } else {
        return await checkId(req, res);
      }
    case 'POST':
      const { action } = req.body;
      if (action === 'login') {
        return await login(req, res);
      } else {
        return await signup(req, res);
      }
    case 'PUT':
      return await updateMemberInfo(req, res);
  }
}

export default withErrorHandler(handler);

// ID 중복 체크
async function checkId(req: NextApiRequest, res: NextApiResponse<CheckIdResponse>) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      available: false,
      message: 'id is required'
    });
  }

  const result = await memberService.checkId(id as string);
  return res.status(200).json(result);
}

// 회원가입
async function signup(req: NextApiRequest, res: NextApiResponse<MemberResponse>) {
  const { id, password, nickname, job, jobInfo, myBadge } = req.body;

  if (!id || !password || !nickname) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'id, password, nickname are required'
    });
  }

  const result = await memberService.signup({
    id,
    password,
    nickname,
    job: job || '',
    jobInfo: jobInfo || '',
    myBadge: myBadge || '',
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json({
    success: true,
    data: result.data,
    message: result.message
  });
}

// 로그인
async function login(req: NextApiRequest, res: NextApiResponse<MemberResponse>) {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'id and password are required'
    });
  }

  const result = await memberService.login({ id, password });

  if (!result.success) {
    return res.status(401).json(result);
  }

  return createSuccessResponse(res, result.data, result.message);
}

// 회원 정보 조회
async function getMemberInfo(req: NextApiRequest, res: NextApiResponse<MemberResponse>) {
  const { idx } = req.query;

  if (!idx) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'idx is required'
    });
  }

  const result = await memberService.getMemberByIdx(Number(idx));

  if (!result.success) {
    return res.status(404).json(result);
  }

  return createSuccessResponse(res, result.data, result.message);
}

// 회원 정보 수정
async function updateMemberInfo(req: NextApiRequest, res: NextApiResponse<MemberResponse>) {
  const { idx, job, jobInfo, myBadge } = req.body;

  if (!idx) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'idx is required'
    });
  }

  const updateData: { job?: string; jobInfo?: string; myBadge?: string } = {};
  if (job !== undefined) updateData.job = job;
  if (jobInfo !== undefined) updateData.jobInfo = jobInfo;
  if (myBadge !== undefined) updateData.myBadge = myBadge;

  const result = await memberService.updateMemberInfo(Number(idx), updateData);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return createSuccessResponse(res, result.data, result.message);
}


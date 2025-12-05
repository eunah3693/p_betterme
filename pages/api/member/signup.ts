import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { MemberResponse } from '@/interfaces/member';
import { withErrorHandler } from '@/lib/api';
import { signupSchema } from '@/lib/validation';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MemberResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Zod로 유효성 검사
  const validation = signupSchema.safeParse(req.body);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
    return res.status(400).json({
      success: false,
      data: null,
      message: errorMessage
    });
  }

  const result = await memberService.signup({
    ...validation.data,
    job: validation.data.job || '',
    jobInfo: validation.data.jobInfo || '',
    myBadge: validation.data.myBadge || '',
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

export default withErrorHandler(handler);


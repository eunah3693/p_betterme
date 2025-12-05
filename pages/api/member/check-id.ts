import { NextApiRequest, NextApiResponse } from 'next';
import { MemberService } from '@/services/memberService';
import { CheckIdResponse } from '@/interfaces/member';
import { withErrorHandler } from '@/lib/api';
import { checkIdSchema } from '@/lib/validation';

const memberService = new MemberService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckIdResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = checkIdSchema.safeParse(req.query);
  
  if (!validation.success) {
    const errorMessage = validation.error.issues[0]?.message || 'Invalid request';
    return res.status(400).json({
      success: false,
      available: false,
      message: errorMessage
    });
  }

  const result = await memberService.checkId(validation.data.id);
  return res.status(200).json(result);
}

export default withErrorHandler(handler);


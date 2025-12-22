import { NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { DiaryResponse } from '@/interfaces/diary';
import { withErrorHandler, createErrorResponse, AuthenticatedRequest, authenticateRequest } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<DiaryResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const user = authenticateRequest(req);

  const { subject, content, date } = req.body;

  if (!subject || !content) {
    return createErrorResponse(res, 400, '제목과 일기를 적어주세요');
  }

  const result = await diaryService.registerDiary({
    memberId: user.id,
    subject,
    content,
    date: date ? new Date(date) : new Date()
  });

  return res.status(201).json({
    success: true,
    message: '일기가 등록되었습니다.',
    data: result,
  });
}

export default withErrorHandler(handler);

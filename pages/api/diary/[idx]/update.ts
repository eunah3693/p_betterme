import { NextApiRequest, NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { DiaryResponse } from '@/interfaces/diary';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiaryResponse | { error: string }>
) {
  if (req.method !== 'PUT') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  const { subject, content, date } = req.body;

  const updateData: {
    subject?: string;
    content?: string;
    date?: Date;
  } = {};

  if (subject) updateData.subject = subject;
  if (content) updateData.content = content;
  if (date) updateData.date = new Date(date);

  const result = await diaryService.updateDiary(Number(idx), updateData);

  return createSuccessResponse(res, result, '일기가 수정되었습니다.');
}

export default withErrorHandler(handler);

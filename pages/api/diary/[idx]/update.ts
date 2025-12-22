import { NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { DiaryResponse, UpdateDiaryData, UpdateDiaryRequest } from '@/interfaces/diary';
import { withErrorHandler, createSuccessResponse, createErrorResponse, AuthenticatedRequest, authenticateRequest } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<DiaryResponse | { error: string }>
) {
  if (req.method !== 'PUT') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const user = authenticateRequest(req);

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  const { subject, content, date } = req.body;

  const updateData: UpdateDiaryData = {
    idx: Number(idx),
    memberId: user.id,
    subject: subject,
    content: content,
    date: new Date(date)
  };

  // 소유자 확인 포함된 업데이트
  const result = await diaryService.updateDiary(updateData);

  if (!result.success) {
    return createErrorResponse(res, 403, result.message || '일기 수정에 실패했습니다.');
  }

  return createSuccessResponse(res, result.data, result.message);
}

export default withErrorHandler(handler);

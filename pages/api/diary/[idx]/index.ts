import { NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { DiaryResponse } from '@/interfaces/diary';
import { withErrorHandler, createSuccessResponse, createErrorResponse, AuthenticatedRequest, authenticateRequest } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<DiaryResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const user = authenticateRequest(req);

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  const result = await diaryService.getDiaryByIdx(Number(idx), user.id);

  if (!result.success) {
    return createErrorResponse(res, 404, result.message || '일기를 찾을 수 없습니다.');
  }

  return createSuccessResponse(res, result.data, result.message);
}

export default withErrorHandler(handler);

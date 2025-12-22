import { NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { DiaryListResponse } from '@/interfaces/diary';
import { withErrorHandler, createSuccessResponse, createErrorResponse, AuthenticatedRequest, authenticateRequest } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<DiaryListResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const user = authenticateRequest(req);
  
  const result = await diaryService.getAllDiaries(user.id);
  
  if (!result.success) {
    return createErrorResponse(res, 500, '일기 목록을 불러오는데 실패했습니다.');
  }

  return createSuccessResponse(res, result.data, '일기 목록 조회 성공');
}

export default withErrorHandler(handler);

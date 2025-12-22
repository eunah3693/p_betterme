import { NextApiResponse } from 'next';
import { DiaryService } from '@/services/diaryService';
import { withErrorHandler, createSuccessResponse, createErrorResponse, AuthenticatedRequest, authenticateRequest } from '@/lib/api';

const diaryService = new DiaryService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<{ success: boolean; message: string } | { error: string }>
) {
  if (req.method !== 'DELETE') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  // 🔐 JWT 토큰에서 로그인한 사용자 정보 추출
  const user = authenticateRequest(req);

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  // 소유자 확인 포함된 삭제
  const result = await diaryService.deleteDiary(Number(idx), user.id);

  if (!result.success) {
    return createErrorResponse(res, 403, result.message || '일기 삭제에 실패했습니다.');
  }

  return createSuccessResponse(res, null, result.message);
}

export default withErrorHandler(handler);

import { NextApiRequest, NextApiResponse } from 'next';
import { ArtService } from '@/services/artService';
import { withErrorHandler, createSuccessResponse, createErrorResponse, validateMethod } from '@/lib/api';

const artService = new ArtService();

// 단일 전시회 조회 API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validateMethod(req, ['GET'])) {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { id } = req.query;

    // ID 유효성 검증
    if (!id || Array.isArray(id)) {
      return createErrorResponse(res, 400, '잘못된 전시회 ID입니다');
    }

    const artId = parseInt(id, 10);
    if (isNaN(artId)) {
      return createErrorResponse(res, 400, '전시회 ID는 숫자여야 합니다');
    }

    // 전시회 조회
    const result = await artService.getArtById(artId);

    if (!result.content) {
      return createErrorResponse(res, 404, '전시회를 찾을 수 없습니다');
    }

    return createSuccessResponse(res, result, '전시회를 성공적으로 조회했습니다');
  } catch (error) {
    console.error('전시회 조회 오류:', error);
    return createErrorResponse(
      res, 
      500, 
      '전시회 조회 중 오류가 발생했습니다',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

export default withErrorHandler(handler);


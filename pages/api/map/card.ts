import { NextApiRequest, NextApiResponse } from 'next';
import { ArtPlaceService } from '@/services/artPlaceService';
import { withErrorHandler, createSuccessResponse, createErrorResponse, validateMethod } from '@/lib/api';

const artPlaceService = new ArtPlaceService();

// 지도 전시회 조회 API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validateMethod(req, ['POST'])) {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  try {
    // body에서 id 배열 추출
    const { id } = req.body;
    
    // 필수 파라미터 검증
    if (!id || !Array.isArray(id)) {
      return createErrorResponse(res, 400, 'id는 숫자 배열이어야 합니다');
    }

    // 배열의 모든 요소가 숫자인지 검증
    if (!id.every((item) => typeof item === 'number')) {
      return createErrorResponse(res, 400, 'id 배열의 모든 요소는 숫자여야 합니다');
    }

    // 지도 전시회 카드 조회
    const result = await artPlaceService.getMapPlaceArts({ id: id });

    return createSuccessResponse(res, result.data, result.message);
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


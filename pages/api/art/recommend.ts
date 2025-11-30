import { NextApiRequest, NextApiResponse } from 'next';
import { ArtService } from '@/services/artService';
import { withErrorHandler, createSuccessResponse, createErrorResponse, validateMethod } from '@/lib/api';

const artService = new ArtService();

// 추천 전시회 조회 API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validateMethod(req, ['GET'])) {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { size = '10' } = req.query;
    const sizeNum = parseInt(size as string) || 10;

    // 추천 전시회 조회
    const result = await artService.getRecommendedArts({ size: sizeNum });

    return createSuccessResponse(res, result, '추천 전시회 목록을 성공적으로 조회했습니다');
  } catch (error) {
    console.error('추천 전시회 조회 오류:', error);
    return createErrorResponse(
      res, 
      500, 
      '추천 전시회 조회 중 오류가 발생했습니다',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

export default withErrorHandler(handler);

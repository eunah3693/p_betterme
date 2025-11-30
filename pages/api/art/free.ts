import { NextApiRequest, NextApiResponse } from 'next';
import { ArtService } from '@/services/artService';
import { withErrorHandler, createSuccessResponse, createErrorResponse, validateMethod } from '@/lib/api';
import { ArtSearchParams } from '@/interfaces/arts';

const artService = new ArtService();

// 무료료 전시회 조회 API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validateMethod(req, ['GET'])) {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  try {
    // 무료 전시회 검색 조건 price: "무료" 추가
    const searchParams: ArtSearchParams = {
      ...req.query,
      price: "무료"
    };

    // 무료료 전시회 조회 메서드 호출 
    const result = await artService.getFreeArts(searchParams);
    console.log(result);

    return createSuccessResponse(res, result, '전시회 목록을 성공적으로 조회했습니다');
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


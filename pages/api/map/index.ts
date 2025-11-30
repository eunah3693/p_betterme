import { NextApiRequest, NextApiResponse } from 'next';
import { ArtPlaceService } from '@/services/artPlaceService';
import { withErrorHandler, createSuccessResponse, createErrorResponse, validateMethod } from '@/lib/api';
import { mapRequestParams } from '@/interfaces/map';

const artPlaceService = new ArtPlaceService();

// 지도 전시회 조회 API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!validateMethod(req, ['POST'])) {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  try {
    const { latitude, longitude, range } = req.body;
    
    // 필수 파라미터 검증
    if (latitude === undefined || longitude === undefined || range === undefined) {
      return createErrorResponse(res, 400, '필수 파라미터(latitude, longitude, range)가 누락되었습니다');
    }

    // 유효성 검증
    const lat = Number(latitude);
    const lon = Number(longitude);
    const rng = Number(range);

    if (isNaN(lat) || isNaN(lon) || isNaN(rng)) {
      return createErrorResponse(res, 400, '위치 정보(latitude, longitude, range)는 숫자여야 합니다');
    }

    if (lat < -90 || lat > 90) {
      return createErrorResponse(res, 400, 'latitude는 -90에서 90 사이의 값이어야 합니다');
    }

    if (lon < -180 || lon > 180) {
      return createErrorResponse(res, 400, 'longitude는 -180에서 180 사이의 값이어야 합니다');
    }

    if (rng <= 0) {
      return createErrorResponse(res, 400, 'range는 0보다 큰 값이어야 합니다');
    }

    const mapSearchParams: mapRequestParams = {
      latitude: lat,
      longitude: lon,
      range: rng,
    };

    // 지도 전시회 
    const result = await artPlaceService.getMapArts(mapSearchParams);

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


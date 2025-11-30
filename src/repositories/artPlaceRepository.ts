import { prisma } from '@/lib/prisma';
import { MapItem, mapRequestParams, MapResponse, MapPlaceResponse} from '@/models/Map';
import { Prisma } from '@prisma/client';

// queryRaw로 가져온 Place 데이터 + distance 필드
interface PlaceWithDistance extends Prisma.PlaceGetPayload<Record<string, never>> {
  distance: number;
}

export class ArtPlaceRepository {
  
  // 미터를 위도/경도 단위로 변환 (대략적인 계산)
  private metersToCoordinates(meters: number, latitude: number) {
    // 1도 = 약 111,000m (위도)
    const latDegree = meters / 111000;
    // 경도는 위도에 따라 달라짐 (cos 함수 사용)
    const lonDegree = meters / (111000 * Math.cos(latitude * Math.PI / 180));
    
    return { latDegree, lonDegree };
  }

  // DB 데이터를 MapItem으로 변환
  private convertToMapItem(art: Prisma.ArtGetPayload<Record<string, never>>, place: PlaceWithDistance): MapItem {
    return {
      id: Number(art.id),
      address: place?.address || undefined,
      latitude: place?.latitude || undefined,
      longitude: place?.longitude || undefined,
      url: place?.url || undefined,
      seq: place?.seq || undefined,
    };
  }
  
  // 전시회 지도 조회 (위치 기반)
  async findPlaceArts(params: mapRequestParams): Promise<MapResponse> {
    const { latitude, longitude, range } = params;

    // 필수 파라미터 검증
    if (!latitude || !longitude || !range) {
      return {
        success: false,
        message: '위치 정보(latitude, longitude, range)가 필요합니다.',
        data: {
          content: [],
        },
      };
    }

    // 범위를 위도/경도로 변환
    const { latDegree, lonDegree } = this.metersToCoordinates(range, latitude);
    
    // 위도/경도 범위 계산
    const minLat = latitude - latDegree;
    const maxLat = latitude + latDegree;
    const minLon = longitude - lonDegree;
    const maxLon = longitude + lonDegree;

    // place 테이블에서 범위 내의 장소 조회 (Haversine 공식 사용)
    const places = await prisma.$queryRaw<PlaceWithDistance[]>`
      SELECT
        *,
        (6371000 * ACOS(
          COS(RADIANS(${latitude}))
          * COS(RADIANS(latitude))
          * COS(RADIANS(longitude) - RADIANS(${longitude}))
          + SIN(RADIANS(${latitude}))
          * SIN(RADIANS(latitude))
        )) AS distance
      FROM place
      WHERE 
        latitude BETWEEN ${minLat} AND ${maxLat}
        AND longitude BETWEEN ${minLon} AND ${maxLon}
      HAVING distance <= ${range}
      ORDER BY distance
    `;

    // 범위 내 place의 ID 추출
    const placeIds = places.map(p => p.id);

    if (placeIds.length === 0) {
      return {
        success: true,
        message: '범위 내에 전시회가 없습니다.',
        data: {
          content: [],
        },
      };
    }

    // 해당 place를 가진 전시회 조회
    const arts = await prisma.art.findMany({
      where: {
        placeId: { in: placeIds },
      },
    });

    // 결과 변환
    const result: MapItem[] = [];
    for (const art of arts) {
      const place = places.find(p => p.id === art.placeId);
      if (place) {
        result.push(this.convertToMapItem(art, place));
      }
    }

    return {
      success: true,
      message: `${result.length}개의 전시회를 찾았습니다.`,
      data: {
        content: result,
      },
    };
  }

  // 전시회 ID 배열로 카드 조회
  async findPlaceCardArts(ids: number[]): Promise<MapPlaceResponse> {
    // 필수 파라미터 검증
    if (!ids || ids.length === 0) {
      return {
        success: false,
        message: 'id 배열이 비어있습니다.',
        data: {
          content: [],
        },
      };
    }

    // 해당 ID를 가진 전시회 조회
    const arts = await prisma.art.findMany({
      where: {
        placeId: { in: ids },
      },
      include: {
        place: true, // place 정보도 함께 조회
      },
    });

    if (arts.length === 0) {
      return {
        success: true,
        message: '해당 ID의 전시회가 없습니다.',
        data: {
          content: [],
        },
      };
    }

    // bigint를 number로 변환
    const result = arts.map(art => ({
      id: Number(art.id),
      placeId: Number(art.placeId),
      thumbnail: art.thumbnail || undefined,
      artCode: art.artCode || undefined,
      artType: art.artType || undefined,
      title: art.title || undefined,
      startDate: art.startDate?.toISOString() || undefined,
      endDate: art.endDate?.toISOString() || undefined,
      price: art.price || undefined,
      placeName: art.placeName || undefined,
      phone: art.phone || undefined,
      address: art.place?.address || undefined,
      latitude: art.place?.latitude || undefined,
      longitude: art.place?.longitude || undefined,
      url: art.place?.url || undefined,
      seq: art.place?.seq || undefined,
    }));

    return {
      success: true,
      message: `${result.length}개의 전시회를 찾았습니다.`,
      data: {
        content: result,
      },
    };
  }

}
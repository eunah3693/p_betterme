import { z } from 'zod';

// 전시회 검색 파라미터 검증 스키마
export const artSearchSchema = z.object({
  artCode: z.string().optional(),
  artType: z.string().optional(),
  title: z.string().optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  endDateFrom: z.string().optional(),
  endDateTo: z.string().optional(),
  area: z.string().optional(),
  sigungu: z.string().optional(),
  placeName: z.string().optional(),
  ongoing: z.boolean().optional(),
  page: z.number().min(1).optional(),
  size: z.number().min(1).max(100).optional(),
  sort: z.string().optional(),
  direction: z.enum(['asc', 'desc']).optional(),
});

// 전시회 생성/수정 검증 스키마
export const artCreateSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  artType: z.string().min(1, '전시회 유형은 필수입니다'),
  artCode: z.string().min(1, '전시회 코드는 필수입니다'),
  startDate: z.string().min(1, '시작일은 필수입니다'),
  endDate: z.string().min(1, '종료일은 필수입니다'),
  price: z.string().optional(),
  placeName: z.string().min(1, '장소명은 필수입니다'),
  area: z.string().optional(),
  sigungu: z.string().optional(),
  thumbnail: z.string().optional(),
  phone: z.string().optional(),
  place: z.object({
    address: z.string().optional(),
    url: z.string().optional(),
    longitude: z.string().optional(),
    latitude: z.string().optional(),
  }).optional(),
});

// 장소 검색 파라미터 검증 스키마
export const placeSearchSchema = z.object({
  name: z.string().optional(),
  area: z.string().optional(),
  sigungu: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  radius: z.number().min(0).max(10000).optional(),
  page: z.number().min(1).optional(),
  size: z.number().min(1).max(100).optional(),
});

// 입력 데이터 검증 함수
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`입력 검증 실패: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
};

// 쿼리 파라미터 검증 함수
export const validateQuery = <T>(schema: z.ZodSchema<T>, query: unknown): T => {
  // query가 객체인지 먼저 확인
  if (!query || typeof query !== 'object') {
    throw new Error('쿼리 파라미터가 유효하지 않습니다');
  }
  
  // 문자열을 적절한 타입으로 변환
  const q = query as Record<string, unknown>;
  const processedQuery: Record<string, unknown> = { ...q };
  
  // 숫자 변환
  if (typeof q.page === 'string') processedQuery.page = parseInt(q.page);
  if (typeof q.size === 'string') processedQuery.size = parseInt(q.size);
  if (typeof q.radius === 'string') processedQuery.radius = parseFloat(q.radius);
  
  // 불린 변환
  if (typeof q.ongoing === 'string') processedQuery.ongoing = q.ongoing === 'true';
  
  return validateInput(schema, processedQuery);
};

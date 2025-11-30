// Place 정보 모델
export interface Place {
  id: number;
  address?: string;
  latitude?: string;
  longitude?: string;
  url?: string;
  seq?: number;
}

// 전시회 데이터 모델
export interface Art {
  id: number;
  title: string;
  artType: string;
  artCode: string;
  startDate: string;
  endDate: string;
  price: string;
  placeName: string;
  area: string;
  sigungu: string;
  thumbnail: string;
  phone: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  place?: Place; 
}


// 일반 전시회 검색 파라미터 모델
export interface ArtSearchParams {
  artCode?: string;
  artType?: string;
  title?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  area?: string;
  sigungu?: string;
  placeName?: string;
  ongoing?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// 단일일 전시회 응답 모델
export interface OneArtResponse {
  content: Art | null;
}

export interface PaginationInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

// 일반 전시회 응답 모델
export interface ArtResponse {
  content: Art[];
  page?: PaginationInfo;
}

// 추천 전시회 모델
export interface RecommendArtSearchParams {
  size?: number;
}

// 추천 전시회 모델
export interface RecommendArtResponse {
  content: Art[];
}

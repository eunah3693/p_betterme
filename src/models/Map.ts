
export interface MapItem {
  id?: number;
  placeId?: number;
  address?: string;
  latitude?: string; 
  longitude?: string;
  url?: string;
  seq?: number;
}


// 전시회 지도 검색 파라미터 모델
export interface mapRequestParams {
  latitude?: number;
  longitude?: number;
  range?: number;
}
export interface mapPlaceRequestParams {
  id: number[];  // id 배열
}

// 전시회 지도 응답 모델
export interface MapResponse {
  success: boolean;
  message: string;
  data:{
    content: MapItem[] | null;
  },
}

export interface mapPlaceItem {
  id?: number;
  placeId?: number;
  thumbnail?: string;
  artCode?: string;
  artType?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  placeName?: string;
  phone?: string;
  address?: string;
  latitude?: string;  // place 테이블과 통일 (varchar)
  longitude?: string; // place 테이블과 통일 (varchar)
  url?: string;
  seq?: number;
  range?: number;
}

// 전시회 지도 응답 모델
export interface MapPlaceResponse {
  success: boolean;
  message: string;
  data:{
    content: mapPlaceItem[] | null;
  },
}

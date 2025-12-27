// Diary 아이템
export interface DiaryItem {
  idx: number;
  memberId?: string | null;
  subject?: string | null;
  content?: string | null;
  date?: string | null;
  isAuthor?: boolean;
}

export interface CreateDiaryRequest {
  subject: string;
  content: string;
  date: Date;
}

export interface CreateDiaryData {
  memberId: string;
  subject: string;
  content: string;
  date: Date;
}

export interface CreateDiaryResponse {
  success: boolean;
  message: string;
  data: DiaryItem; 
}

// Diary 수정 요청
export interface UpdateDiaryRequest {
  idx: number;
  subject?: string;
  content?: string;
  date?: Date;
}
export interface UpdateDiaryData {
  idx: number;
  memberId: string;
  subject?: string;
  content?: string;
  date?: Date;
}
// Diary 응답
export interface DiaryResponse {
  success: boolean;
  data: DiaryItem | DiaryItem[];
  message?: string;
}

// Diary 목록 요청 (더 이상 memberId 필요 없음 - JWT에서 자동 추출)
export interface DiaryListRequest {
  // 서버가 JWT 토큰에서 자동으로 사용자 ID를 추출하므로 파라미터 불필요
}

// Diary 목록 응답
export interface DiaryListResponse {
  success: boolean;
  data: DiaryItem[];
  message?: string;
}


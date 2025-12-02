// Diary 아이템
export interface DiaryItem {
  idx: number;
  memberId?: string | null;
  subject?: string | null;
  content?: string | null;
  date?: string | null;
}

// Diary 등록 요청
export interface CreateDiaryRequest {
  memberId: string;
  subject: string;
  content: string;
  date: string; // YYYY-MM-DD
}

// Diary 수정 요청
export interface UpdateDiaryRequest {
  idx: number;
  subject?: string;
  content?: string;
  date?: string;
}

// Diary 응답
export interface DiaryResponse {
  success: boolean;
  data: DiaryItem | DiaryItem[];
  message?: string;
}

// Diary 목록 응답
export interface DiaryListResponse {
  success: boolean;
  data: DiaryItem[];
}


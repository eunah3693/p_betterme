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

// Diary 목록 요청 
export type DiaryListRequest = Record<string, never>;

// Diary 목록 응답
export interface DiaryListResponse {
  success: boolean;
  data: DiaryItem[];
  message?: string;
}


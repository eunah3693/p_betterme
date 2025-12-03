// Blog 아이템
export interface BlogItem {
  idx: number;
  memberId?: string | null;
  subject?: string | null;
  content?: string | null;
  date?: string | null;
}

// Blog 등록 요청
export interface CreateBlogRequest {
  memberId: string;
  subject: string;
  content: string;
  date: string; // YYYY-MM-DD
}

// Blog 수정 요청
export interface UpdateBlogRequest {
  idx: number;
  subject?: string;
  content?: string;
  date?: string;
}

// Blog 응답
export interface BlogResponse {
  success: boolean;
  data: BlogItem | BlogItem[];
  message?: string;
}

// Blog 목록 응답
export interface BlogListResponse {
  success: boolean;
  data: BlogItem[];
}






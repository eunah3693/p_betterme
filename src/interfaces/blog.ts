// Blog 아이템
export interface BlogItem {
  idx: number;
  memberId?: string | null;
  subject?: string | null;
  content?: string | null;
  date?: string | null;
  isAuthor?: boolean;
}

// Blog 등록 요청
export interface CreateBlogRequest {
  memberId: string;
  subject: string;
  content: string;
  date: Date;
}

// Blog 수정 요청
export interface UpdateBlogRequest {
  idx: number;
  memberId?: string;
  subject?: string;
  content?: string;
  date?: Date;
}

export interface BlogRequest {
  idx: number;
  id: string;
}

// Blog 응답
export interface BlogResponse {
  success: boolean;
  data: BlogItem | BlogItem[];
  message?: string;
}

// 내 Blog 목록 요청
export interface MyBlogRequest {
  memberId: string;
}

// Blog 목록 요청
export interface BlogListRequest {
  page: number;
}

// Blog 목록 응답
export interface BlogListResponse {
  success: boolean;
  data: BlogItem[];
  page?: {
    number: number;
    totalPages: number;
    totalElements: number;
    size: number;
  };
}











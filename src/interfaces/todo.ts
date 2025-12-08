// Todo 조회 요청
export interface TodoRequest {
  memberId: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
}

// Todo 생성 요청
export interface CreateTodoRequest {
  memberId: string;
  projectId?: string;
  subject: string;
  content?: string;
  finish?: string;
  startDate: Date;
  finishDate: Date;
}

// Todo 수정 요청
export interface UpdateTodoRequest {
  subject?: string;
  content?: string;
  finish?: string;
  startDate?: Date;
  finishDate?: Date;
}

// Todo 아이템
export interface TodoItem {
  idx: number;
  memberId: string | null;
  projectId: string | null;
  subject: string | null;
  content: string | null;
  finish: string | null;
  startDate: string | null;  // YYYY-MM-DD
  finishDate: string | null; // YYYY-MM-DD
}

// Todo 응답
export interface TodoResponse {
  success: boolean;
  data: TodoItem[];
  message?: string;
}
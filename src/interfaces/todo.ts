// Todo 조회 요청
export interface MonthlyTodoRequest {
  memberId: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
}

// Todo 아이템
export interface TodoItem {
  idx: number;
  memberId: string | null;
  projectId: string | null;
  subject: string | null;
  content: string | null;
  finish: string | null;
  date: string | null;  // YYYY-MM-DD
}

// Todo 응답
export interface MonthlyTodoResponse {
  success: boolean;
  data: TodoItem[];
}
import { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/services/todoService';
import { TodoResponse } from '@/interfaces/todo';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';

const todoService = new TodoService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { memberId, startDate, endDate } = req.query;

  if (!memberId || !startDate || !endDate) {
    return createErrorResponse(res, 400, 'memberId, startDate, endDate는 필수입니다');
  }

  const result = await todoService.viewTodo(
    memberId as string,
    startDate as string,
    endDate as string
  );

  if (!result.success) {
    return createErrorResponse(res, 500, 'Todo 목록을 불러오는데 실패했습니다.');
  }

  return createSuccessResponse(res, result.data, 'Todo 목록 조회 성공');
}

export default withErrorHandler(handler);

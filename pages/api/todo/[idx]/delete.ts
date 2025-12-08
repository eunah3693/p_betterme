import { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/services/todoService';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';

const todoService = new TodoService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message: string } | { error: string }>
) {
  if (req.method !== 'DELETE') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  await todoService.deleteTodo(Number(idx));

  return createSuccessResponse(res, null, 'Todo가 삭제되었습니다.');
}

export default withErrorHandler(handler);

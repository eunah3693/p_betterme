import { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/services/todoService';
import { TodoResponse } from '@/interfaces/todo';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';

const todoService = new TodoService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponse | { error: string }>
) {
  if (req.method !== 'PUT') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  const { subject, content, finish, startDate, finishDate } = req.body;

  const updateData: {
    subject?: string;
    content?: string;
    finish?: string;
    startDate?: Date;
    finishDate?: Date;
  } = {};

  if (subject) updateData.subject = subject;
  if (content) updateData.content = content;
  if (finish) updateData.finish = finish;
  if (startDate) updateData.startDate = new Date(startDate);
  if (finishDate) updateData.finishDate = new Date(finishDate);

  const result = await todoService.updateTodo(Number(idx), updateData);

  return createSuccessResponse(res, result, 'Todo가 수정되었습니다.');
}

export default withErrorHandler(handler);

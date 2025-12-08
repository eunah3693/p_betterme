import { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/services/todoService';
import { TodoItem } from '@/interfaces/todo';
import { withErrorHandler, createErrorResponse } from '@/lib/api';

const todoService = new TodoService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data: TodoItem; message: string } | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { memberId, projectId, subject, content, finish, startDate, finishDate } = req.body;

  if (!memberId || !subject || !startDate || !finishDate) {
    return createErrorResponse(res, 400, 'memberId, subject, startDate, finishDate는 필수입니다');
  }

  const result = await todoService.createTodo({
    memberId,
    projectId,
    subject,
    content,
    finish: finish || '0',
    startDate: new Date(startDate),
    finishDate: new Date(finishDate)
  });

  return res.status(201).json({
    success: true,
    message: 'Todo가 등록되었습니다.',
    data: result,
  });
}

export default withErrorHandler(handler);

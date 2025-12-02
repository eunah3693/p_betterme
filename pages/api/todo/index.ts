import { NextApiRequest, NextApiResponse } from 'next';
import { TodoService } from '@/services/todoService';
import { TodoResponse } from '@/interfaces/todo';
import { withErrorHandler, validateMethod, createErrorResponse } from '@/lib/api';

const todoService = new TodoService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponse | { error: string }>
) {

  if (!validateMethod(req, ['GET', 'POST', 'PUT', 'DELETE'])) {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      success: false, 
      data: [] 
    });
  }

  // 메서드별 처리
  switch (req.method) {
    case 'GET':
      return await viewTodo(req, res);
    case 'POST':
      return await createTodo(req, res);
    case 'PUT':
      return await updateTodo(req, res);
    case 'DELETE':
      return await deleteTodo(req, res);
  }
}

// withErrorHandler로 자동 에러 처리
export default withErrorHandler(handler);

// Todo 조회
async function viewTodo(
  req: NextApiRequest,
  res: NextApiResponse<TodoResponse>
) {
  const { memberId, startDate, endDate } = req.query;

  if (!memberId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      data: []
    });
  }

  const result = await todoService.viewTodo(
    memberId as string,
    startDate as string,
    endDate as string
  );

  return res.status(200).json(result);
}

// Todo 생성
async function createTodo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { memberId, projectId, subject, content, finish, date } = req.body;

  if (!memberId || !subject || !date) {
    return res.status(400).json({ error: 'memberId, subject, date는 필수입니다' });
  }

  const result = await todoService.createTodo({
    memberId,
    projectId,
    subject,
    content,
    finish: finish || 'N',
    date: new Date(date)
  });

  return res.status(201).json({ success: true, data: result });
}

// Todo 수정
async function updateTodo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idx, subject, content, finish, date } = req.body;

  if (!idx) {
    return res.status(400).json({ error: 'idx는 필수입니다' });
  }

  const updateData: {
    subject?: string;
    content?: string;
    finish?: string;
    date?: Date;
  } = {};

  if (subject) updateData.subject = subject;
  if (content) updateData.content = content;
  if (finish) updateData.finish = finish;
  if (date) updateData.date = new Date(date);

  const result = await todoService.updateTodo(Number(idx), updateData);

  return res.status(200).json({ success: true, data: result });
}

// Todo 삭제
async function deleteTodo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idx } = req.query;

  if (!idx) {
    return res.status(400).json({ error: 'idx는 필수입니다' });
  }

  await todoService.deleteTodo(Number(idx));

  return res.status(200).json({ success: true, message: 'Todo 삭제 완료' });
}


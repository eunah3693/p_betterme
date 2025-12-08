import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogResponse } from '@/interfaces/blog';
import { withErrorHandler, createSuccessResponse, createErrorResponse } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | { error: string }>
) {
  if (req.method !== 'PUT') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }

  const { subject, content, date } = req.body;

  const updateData: {
    subject?: string;
    content?: string;
    date?: Date;
  } = {};

  if (subject) updateData.subject = subject;
  if (content) updateData.content = content;
  if (date) updateData.date = new Date(date);

  const result = await blogService.updateBlog(Number(idx), updateData);

  return createSuccessResponse(res, result, '블로그가 수정되었습니다.');
}

export default withErrorHandler(handler);

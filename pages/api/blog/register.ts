import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogResponse } from '@/interfaces/blog';
import { withErrorHandler, createErrorResponse } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { memberId, subject, content, date } = req.body;

  if (!memberId || !subject || !content) {
    return createErrorResponse(res, 400, 'memberId, subject, content는 필수입니다');
  }

  const result = await blogService.registerBlog({
    memberId,
    subject,
    content,
    date: date ? new Date(date) : new Date()
  });

  return res.status(201).json({
    success: true,
    message: '블로그가 등록되었습니다.',
    data: result,
  });
}

export default withErrorHandler(handler);

import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogCategoryResponse } from '@/interfaces/blog';
import { withErrorHandler, createErrorResponse } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogCategoryResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { memberId } = req.query;

  if (!memberId || typeof memberId !== 'string') {
    return createErrorResponse(res, 400, 'memberId는 필수입니다');
  }

  const result = await blogService.getCategoriesByMemberId(memberId);

  return res.status(200).json(result);
}

export default withErrorHandler(handler);

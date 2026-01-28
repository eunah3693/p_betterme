import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogCategoryResponse } from '@/interfaces/blog';
import { withErrorHandler, createErrorResponse } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogCategoryResponse | { error: string }>
) {
  if (req.method !== 'PUT') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx, categoryName, order } = req.body;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx는 필수입니다');
  }

  const result = await blogService.updateCategory({
    idx: Number(idx),
    categoryName,
    order
  });

  return res.status(200).json(result);
}

export default withErrorHandler(handler);

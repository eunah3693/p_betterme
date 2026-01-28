import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogCategoryResponse } from '@/interfaces/blog';
import { withErrorHandler, createErrorResponse } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogCategoryResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { memberId, categoryName, order } = req.body;

  if (!memberId || !categoryName) {
    return createErrorResponse(res, 400, 'memberId와 categoryName은 필수입니다');
  }

  const result = await blogService.registerCategory({
    memberId,
    categoryName,
    order: order || 0
  });

  return res.status(201).json(result);
}

export default withErrorHandler(handler);

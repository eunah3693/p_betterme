import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogResponse } from '@/interfaces/blog';
import { withErrorHandler, createSuccessResponse, createErrorResponse, getOptionalUser } from '@/lib/api';


const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const { idx } = req.query;

  if (!idx) {
    return createErrorResponse(res, 400, 'idx is required');
  }
  
  const user = getOptionalUser(req);

  const result = await blogService.getBlogByIdx({ idx: Number(idx), id: user?.id || '' });

  if (!result.success) {
    return createErrorResponse(res, 404, result.message || '블로그를 찾을 수 없습니다.');
  }

  return createSuccessResponse(res, result.data, result.message);
}

export default withErrorHandler(handler);

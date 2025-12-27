import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogResponse, UpdateBlogRequest } from '@/interfaces/blog';
import { withErrorHandler, createSuccessResponse, createErrorResponse, authenticateRequest  } from '@/lib/api';

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

  const user = authenticateRequest(req);

  const updateData: UpdateBlogRequest = {
    ...req.body,
    idx: Number(idx) 
  };

  if(user.id !== updateData.memberId) {
    return createErrorResponse(res, 403, '권한이 없습니다.');
  }

  const result = await blogService.updateBlog({ 
    ...updateData, 
    memberId: user.id,
    idx: Number(idx) 
  });

  return createSuccessResponse(res, result, '블로그가 수정되었습니다.');
}

export default withErrorHandler(handler);











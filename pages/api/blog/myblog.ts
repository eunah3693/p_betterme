import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogListResponse } from '@/interfaces/blog';
import { withErrorHandler, createSuccessResponse, createErrorResponse, authenticateRequest } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogListResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return createErrorResponse(res, 405, 'Method not allowed');
  }

  const user = authenticateRequest(req);
  
  // 페이지 번호 받기 (기본값: 0)
  const { page = 0 } = req.body;

  const result = await blogService.getMyBlogs(user.id, { page });
  
  if (!result.success) {
    return createErrorResponse(res, 500, '블로그 목록을 불러오는데 실패했습니다.');
  }

  return createSuccessResponse(res, result.data, '블로그 목록 조회 성공', result.page);
}

export default withErrorHandler(handler);

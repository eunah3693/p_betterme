import { NextApiRequest, NextApiResponse } from 'next';
import { BlogService } from '@/services/blogService';
import { BlogResponse, BlogListResponse } from '@/interfaces/blog';
import { withErrorHandler, validateMethod } from '@/lib/api';

const blogService = new BlogService();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | BlogListResponse | { error: string }>
) {
  if (!validateMethod(req, ['GET', 'POST', 'PUT', 'DELETE'])) {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      success: false, 
      data: [] 
    });
  }

  switch (req.method) {
    case 'GET':
      return await getBlogs(req, res);
    case 'POST':
      return await registerBlog(req, res);
    case 'PUT':
      return await updateBlog(req, res);
    case 'DELETE':
      return await deleteBlog(req, res);
  }
}

export default withErrorHandler(handler);

// 블로그 조회 (전체 또는 특정)
async function getBlogs(
  req: NextApiRequest,
  res: NextApiResponse<BlogResponse | BlogListResponse>
) {
  const { idx } = req.query;

  // 특정 블로그 조회
  if (idx) {
    const result = await blogService.getBlogByIdx(Number(idx));
    return res.status(200).json(result);
  }

  // 전체 블로그 조회
  const result = await blogService.getAllBlogs();
  return res.status(200).json(result);
}

// 블로그 등록
async function registerBlog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { memberId, subject, content, date } = req.body;

  if (!memberId || !subject || !content) {
    return res.status(400).json({ 
      error: 'memberId, subject, content는 필수입니다',
      success: false,
      data: []
    });
  }

  const result = await blogService.registerBlog({
    memberId,
    subject,
    content,
    date: date ? new Date(date) : new Date()
  });

  return res.status(201).json({ 
    success: true, 
    data: result,
    message: '블로그가 등록되었습니다.'
  });
}

// 블로그 수정
async function updateBlog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idx, subject, content, date } = req.body;

  if (!idx) {
    return res.status(400).json({ 
      error: 'idx는 필수입니다',
      success: false,
      data: []
    });
  }

  const updateData: {
    subject?: string;
    content?: string;
    date?: Date;
  } = {};

  if (subject) updateData.subject = subject;
  if (content) updateData.content = content;
  if (date) updateData.date = new Date(date);

  const result = await blogService.updateBlog(Number(idx), updateData);

  return res.status(200).json({ 
    success: true, 
    data: result,
    message: '블로그가 수정되었습니다.'
  });
}

// 블로그 삭제
async function deleteBlog(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { idx } = req.query;

  if (!idx) {
    return res.status(400).json({ 
      error: 'idx는 필수입니다',
      success: false,
      data: []
    });
  }

  await blogService.deleteBlog(Number(idx));

  return res.status(200).json({ 
    success: true, 
    data: [],
    message: '블로그가 삭제되었습니다.' 
  });
}


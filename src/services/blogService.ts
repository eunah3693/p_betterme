import { BlogRepository } from '@/repositories/blogRepository';
import { BlogItem, BlogListResponse, BlogResponse } from '@/interfaces/blog';

export class BlogService {
  private blogRepository: BlogRepository;
  
  constructor() {
    this.blogRepository = new BlogRepository();
  }
  
  // 모든 블로그 조회
  async getAllBlogs(): Promise<BlogListResponse> {
    try {
      const blogs = await this.blogRepository.getAllBlogs();
      return {
        success: true,
        data: blogs
      };
    } catch (error) {
      console.error('블로그 목록 조회 실패:', error);
      return {
        success: false,
        data: []
      };
    }
  }
  
  // 특정 블로그 조회
  async getBlogByIdx(idx: number): Promise<BlogResponse> {
    try {
      const blog = await this.blogRepository.getBlogByIdx(idx);
      if (!blog) {
        return {
          success: false,
          data: [],
          message: '블로그를 찾을 수 없습니다.'
        };
      }
      return {
        success: true,
        data: blog
      };
    } catch (error) {
      console.error('블로그 조회 실패:', error);
      return {
        success: false,
        data: [],
        message: '블로그 조회 중 오류가 발생했습니다.'
      };
    }
  }
  
  // 블로그 등록
  async registerBlog(data: {
    memberId: string;
    subject: string;
    content: string;
    date: Date;
  }): Promise<BlogItem> {
    return await this.blogRepository.createBlog(data);
  }
  
  // 블로그 수정
  async updateBlog(idx: number, data: {
    subject?: string;
    content?: string;
    date?: Date;
  }): Promise<BlogItem> {
    return await this.blogRepository.updateBlog(idx, data);
  }
  
  // 블로그 삭제
  async deleteBlog(idx: number): Promise<void> {
    await this.blogRepository.deleteBlog(idx);
  }
}

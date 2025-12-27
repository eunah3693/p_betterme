import { BlogRepository } from '@/repositories/blogRepository';
import { BlogItem, BlogListRequest, BlogRequest, BlogListResponse, BlogResponse, UpdateBlogRequest } from '@/interfaces/blog';

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

  // 추천 블로그 조회
  async getRecommendedBlogs(params: BlogListRequest): Promise<BlogListResponse> {
    try {
      const blogs = await this.blogRepository.getRecommendedBlogs( { page : params.page });
      return {
        success: true,
        data: blogs.data,
        page: {
          number: blogs.page?.number || 0,
          totalPages: blogs.page?.totalPages || 0,
          totalElements: blogs.page?.totalElements || 0,
          size: blogs.page?.size || 0
        }
      }
    } catch (error) {
      console.error('블로그 목록 조회 실패:', error);
      return {
        success: false,
        data: []
      };
    }
  }
  
  // 많이본 블로그 조회
  async getMostViewedBlogs(params: BlogListRequest): Promise<BlogListResponse> {
    try {
      const blogs = await this.blogRepository.getMostViewedBlogs( { page : params.page });
      return {
        success: true,
        data: blogs.data,
        page: {
          number: blogs.page?.number || 0,
          totalPages: blogs.page?.totalPages || 0,
          totalElements: blogs.page?.totalElements || 0,
          size: blogs.page?.size || 0
        }
      };
    } catch (error) {
      console.error('블로그 목록 조회 실패:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  // 이달의 블로그 조회
  async getMonthlyBlogs(params: BlogListRequest): Promise<BlogListResponse> {
    try {
      const blogs = await this.blogRepository.getMonthlyBlogs( { page : params.page });
      return {
        success: true,
        data: blogs.data,
        page: {
          number: blogs.page?.number || 0,
          totalPages: blogs.page?.totalPages || 0,
          totalElements: blogs.page?.totalElements || 0,
          size: blogs.page?.size || 0
        }
      };
    } catch (error) {
      console.error('블로그 목록 조회 실패:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  // 내 블로그 조회 
  async getMyBlogs(memberId: string, params: BlogListRequest): Promise<BlogListResponse> {
    try {
      const result = await this.blogRepository.getMyBlogs(memberId, params);
      return {
        success: true,
        data: result.data,
        page: result.page
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
  async getBlogByIdx(params: BlogRequest): Promise<BlogResponse> {
    try {
      const blog = await this.blogRepository.getBlogByIdx(params.idx);
      if (!blog) {
        return {
          success: false,
          data: [],
          message: '블로그를 찾을 수 없습니다.'
        };
      }
      return {
        success: true,
        data: {
          ...blog,
          isAuthor: blog.memberId === params.id
        }
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
  async updateBlog(data: UpdateBlogRequest): Promise<BlogItem> {
    return await this.blogRepository.updateBlog(data);
  }
  
  // 블로그 삭제
  async deleteBlog(idx: number): Promise<void> {
    await this.blogRepository.deleteBlog(idx);
  }
}

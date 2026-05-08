import { BlogRepository } from '@/repositories/blogRepository';
import { 
  BlogItem, 
  BlogListRequest, 
  BlogRequest, 
  BlogListResponse, 
  BlogResponse, 
  UpdateBlogRequest,
  BlogCategoryResponse,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest
} from '@/interfaces/blog';

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

  async getBlogsByMinViewCount(minViewCount: number): Promise<BlogListResponse> {
    try {
      const blogs = await this.blogRepository.getBlogsByMinViewCount(minViewCount);

      return {
        success: true,
        data: blogs
      };
    } catch (error) {
      console.error('조회수 기준 블로그 목록 조회 실패:', error);
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

  async incrementBlogViewCount(idx: number): Promise<BlogResponse> {
    try {
      const blog = await this.blogRepository.incrementBlogViewCount(idx);

      if (!blog) {
        return {
          success: false,
          data: [],
          message: '블로그를 찾을 수 없습니다.'
        };
      }

      return {
        success: true,
        data: blog,
        message: '조회수가 증가되었습니다.'
      };
    } catch (error) {
      console.error('블로그 조회수 증가 실패:', error);
      return {
        success: false,
        data: [],
        message: '블로그 조회수 증가 중 오류가 발생했습니다.'
      };
    }
  }
  
  // 블로그 등록
  async registerBlog(data: {
    memberId: string;
    subject: string;
    content: string;
    date: Date;
    categoryIdx?: number | null;
  }): Promise<BlogItem> {
    return await this.blogRepository.createBlog(data);
  }
  
  // 블로그 수정
  async updateBlog(data: UpdateBlogRequest & { memberId: string }): Promise<BlogResponse> {
    try {
      const blog = await this.blogRepository.updateBlogByIdxAndMemberId(data);

      if (!blog) {
        return {
          success: false,
          data: [],
          message: '블로그를 찾을 수 없거나 수정 권한이 없습니다.'
        };
      }

      return {
        success: true,
        data: blog,
        message: '블로그가 수정되었습니다.'
      };
    } catch (error) {
      console.error('블로그 수정 실패:', error);
      return {
        success: false,
        data: [],
        message: '블로그 수정 중 오류가 발생했습니다.'
      };
    }
  }
  
  // 블로그 삭제
  async deleteBlog(idx: number, memberId: string): Promise<BlogResponse> {
    try {
      const deleted = await this.blogRepository.deleteBlogByIdxAndMemberId(idx, memberId);

      if (!deleted) {
        return {
          success: false,
          data: [],
          message: '블로그를 찾을 수 없거나 삭제 권한이 없습니다.'
        };
      }

      return {
        success: true,
        data: [],
        message: '블로그가 삭제되었습니다.'
      };
    } catch (error) {
      console.error('블로그 삭제 실패:', error);
      return {
        success: false,
        data: [],
        message: '블로그 삭제 중 오류가 발생했습니다.'
      };
    }
  }

  // ========== 블로그 카테고리 관련 서비스 ==========

  // 특정 사용자의 카테고리 목록 조회
  async getCategoriesByMemberId(memberId: string): Promise<BlogCategoryResponse> {
    try {
      const categories = await this.blogRepository.getCategoriesByMemberId(memberId);
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('카테고리 목록 조회 실패:', error);
      return {
        success: false,
        data: [],
        message: '카테고리 목록 조회 중 오류가 발생했습니다.'
      };
    }
  }

  // 카테고리 등록
  async registerCategory(data: CreateBlogCategoryRequest): Promise<BlogCategoryResponse> {
    try {
      const category = await this.blogRepository.createCategory(data);
      return {
        success: true,
        data: category,
        message: '카테고리가 등록되었습니다.'
      };
    } catch (error) {
      console.error('카테고리 등록 실패:', error);
      return {
        success: false,
        data: [],
        message: '카테고리 등록 중 오류가 발생했습니다.'
      };
    }
  }

  async updateCategoryByMemberId(memberId: string, data: UpdateBlogCategoryRequest): Promise<BlogCategoryResponse> {
    try {
      const category = await this.blogRepository.updateCategoryByIdxAndMemberId(memberId, data);

      if (!category) {
        return {
          success: false,
          data: [],
          message: '카테고리를 찾을 수 없거나 수정 권한이 없습니다.'
        };
      }

      return {
        success: true,
        data: category,
        message: '카테고리가 수정되었습니다.'
      };
    } catch (error) {
      console.error('카테고리 수정 실패:', error);
      return {
        success: false,
        data: [],
        message: '카테고리 수정 중 오류가 발생했습니다.'
      };
    }
  }

  // 카테고리 삭제
  async deleteCategoryByMemberId(idx: number, memberId: string): Promise<BlogCategoryResponse> {
    try {
      const deleted = await this.blogRepository.deleteCategoryByIdxAndMemberId(idx, memberId);

      if (!deleted) {
        return {
          success: false,
          data: [],
          message: '카테고리를 찾을 수 없거나 삭제 권한이 없습니다.'
        };
      }

      return {
        success: true,
        data: [],
        message: '카테고리가 삭제되었습니다.'
      };
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      return {
        success: false,
        data: [],
        message: '카테고리 삭제 중 오류가 발생했습니다.'
      };
    }
  }
}

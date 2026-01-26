import { prisma } from '@/lib/prisma';
import { BlogItem, BlogListRequest, CreateBlogRequest, UpdateBlogRequest, BlogListResponse } from '@/interfaces/blog';
import { Prisma } from '@prisma/client';

export class BlogRepository {
  
  // DB 데이터를 BlogItem으로 변환
  private changeToBlogItem(dbRow: Prisma.BlogGetPayload<Record<string, never>>): BlogItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      subject: dbRow.subject,
      content: dbRow.content,
      date: dbRow.date ? dbRow.date.toISOString().split('T')[0] : null,
    };
  }

  // 모든 블로그 조회
  async getAllBlogs(): Promise<BlogItem[]> {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return blogs.map(blog => this.changeToBlogItem(blog));
  }

  // 추천 블로그 조회 (좋아요 많은 순)
  async getRecommendedBlogs(params: BlogListRequest): Promise<BlogListResponse> {
    const pageSize = 12;
    const skip = params.page * pageSize;

    // 전체 개수 조회
    const totalElements = await prisma.blog.count();

    // 데이터 조회 (likeCount가 문자열이므로 null이 아닌 것만 필터링)
    const blogs = await prisma.blog.findMany({
      where: {
        likeCount: {
          not: null
        }
      },
      orderBy: {
        likeCount: 'desc'
      },
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map(blog => this.changeToBlogItem(blog)),
      page: {
        number: params.page,
        totalPages: totalPages,
        totalElements: totalElements,
        size: pageSize
      }
    };
  }

  // 많이본 블로그 조회 (조회수 많은 순)
  async getMostViewedBlogs(params: BlogListRequest): Promise<BlogListResponse> {
    const pageSize = 12;
    const skip = params.page * pageSize;

    // 전체 개수 조회
    const totalElements = await prisma.blog.count();

    // 데이터 조회 (viewCount가 문자열이므로 null이 아닌 것만 필터링)
    const blogs = await prisma.blog.findMany({
      where: {
        viewCount: {
          not: null
        }
      },
      orderBy: {
        viewCount: 'desc'
      },
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map(blog => this.changeToBlogItem(blog)),
      page: {
        number: params.page,
        totalPages: totalPages,
        totalElements: totalElements,
        size: pageSize
      }
    };
  }
  
  // 이달의 블로그 조회 (이번 달 작성된 글)
  async getMonthlyBlogs(params: BlogListRequest): Promise<BlogListResponse> {
    const pageSize = 12;
    const skip = params.page * pageSize;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 이번 달 데이터 개수 조회
    const totalElements = await prisma.blog.count({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // 데이터 조회
    const blogs = await prisma.blog.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      orderBy: {
        date: 'desc'
      },
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map(blog => this.changeToBlogItem(blog)),
      page: {
        number: params.page,
        totalPages: totalPages,
        totalElements: totalElements,
        size: pageSize
      }
    };
  }

  // 내 블로그 조회 
  async getMyBlogs(memberId: string, params: BlogListRequest): Promise<BlogListResponse> {
    const pageSize = 12;
    const skip = params.page * pageSize;

    // 전체 개수 조회
    const totalElements = await prisma.blog.count({
      where: { memberId },
      orderBy: {
        date: 'desc'
      }
    });

    // 데이터 조회
    const blogs = await prisma.blog.findMany({
      where: { memberId },
      orderBy: {
        date: 'desc'
      },
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map(blog => this.changeToBlogItem(blog)),
      page: {
        number: params.page,
        totalPages,
        totalElements,
        size: pageSize
      }
    };
  }

  // 특정 블로그 조회
  async getBlogByIdx(idx: number): Promise<BlogItem | null> {
    const blog = await prisma.blog.findUnique({
      where: { idx }
    });

    if (!blog) {
      return null;
    }

    return this.changeToBlogItem(blog);
  }

  // 블로그 추가
  async createBlog(data: CreateBlogRequest): Promise<BlogItem> {
    const blog = await prisma.blog.create({
      data: {
        memberId: data.memberId,
        subject: data.subject,
        content: data.content,
        date: data.date,
      }
    });

    return this.changeToBlogItem(blog);
  }

  // 블로그 수정
  async updateBlog(data: UpdateBlogRequest): Promise<BlogItem> {
    const blog = await prisma.blog.update({
      where: { idx: data.idx },
      data: {
        subject: data.subject,
        content: data.content,
        date: data.date,
      }
    });

    return this.changeToBlogItem(blog);
  }

  // 블로그 삭제
  async deleteBlog(idx: number): Promise<void> {
    await prisma.blog.delete({
      where: { idx }
    });
  }
}
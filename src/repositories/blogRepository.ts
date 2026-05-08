import { prisma } from '@/lib/prisma';
import { 
  BlogItem, 
  BlogListRequest, 
  CreateBlogRequest, 
  UpdateBlogRequest, 
  BlogListResponse,
  BlogCategoryItem,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest
} from '@/interfaces/blog';


type BlogRow = Awaited<ReturnType<typeof prisma.blog.findMany>>[number];
type BlogCategoryRow = Awaited<ReturnType<typeof prisma.blogCategory.findMany>>[number];

export class BlogRepository {
  
  // DB 데이터를 BlogItem으로 변환
  private changeToBlogItem(dbRow: BlogRow): BlogItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      subject: dbRow.subject,
      content: dbRow.content,
      date: dbRow.date ? dbRow.date.toISOString().split('T')[0] : null,
      viewCount: dbRow.viewCount,
    };
  }

  // 모든 블로그 조회
  async getAllBlogs(): Promise<BlogItem[]> {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return blogs.map((blog: BlogRow) => this.changeToBlogItem(blog));
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
      orderBy: [
        {
          likeCount: 'desc'
        },
        {
          idx: 'desc'
        }
      ],
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map((blog: BlogRow) => this.changeToBlogItem(blog)),
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
      orderBy: [
        {
          viewCount: 'desc'
        },
        {
          idx: 'desc'
        }
      ],
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map((blog: BlogRow) => this.changeToBlogItem(blog)),
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
      orderBy: [
        {
          date: 'desc'
        },
        {
          idx: 'desc'
        }
      ],
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map((blog: BlogRow) => this.changeToBlogItem(blog)),
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

    // 조건부로 where 객체 생성 
    const whereCondition =
      params.categoryIdx !== undefined && params.categoryIdx !== null
        ? { memberId, categoryIdx: params.categoryIdx }
        : { memberId };

    // 전체 개수 조회
    const totalElements = await prisma.blog.count({
      where: whereCondition,
      orderBy: {
        date: 'desc'
      }
    });

    // 데이터 조회
    const blogs = await prisma.blog.findMany({
      where: whereCondition,
      orderBy: [
        {
          date: 'desc'
        },
        {
          idx: 'desc'
        }
      ],
      skip: skip,
      take: pageSize
    });

    const totalPages = Math.ceil(totalElements / pageSize);

    return {
      success: true,
      data: blogs.map((blog: BlogRow) => this.changeToBlogItem(blog)),
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

  async incrementBlogViewCount(idx: number): Promise<BlogItem | null> {
    await prisma.$executeRaw`
      UPDATE blog
      SET view_count = (
        CASE
          WHEN view_count ~ '^[0-9]+$' THEN view_count::integer
          ELSE 0
        END + 1
      )::text
      WHERE idx = ${idx}
    `;

    return this.getBlogByIdx(idx);
  }

  // 블로그 추가
  async createBlog(data: CreateBlogRequest): Promise<BlogItem> {
    const blog = await prisma.blog.create({
      data: {
        memberId: data.memberId,
        subject: data.subject,
        content: data.content,
        date: data.date, 
        categoryIdx: data.categoryIdx || 0         
      }
    });

    return this.changeToBlogItem(blog);
  }

  async updateBlogByIdxAndMemberId(data: UpdateBlogRequest & { memberId: string }): Promise<BlogItem | null> {
    const blog = await prisma.blog.findFirst({
      where: { idx: data.idx, memberId: data.memberId }
    });

    if (!blog) {
      return null;
    }

    const updatedBlog = await prisma.blog.update({
      where: { idx: data.idx },
      data: {
        subject: data.subject,
        content: data.content,
        date: data.date,
      }
    });

    return this.changeToBlogItem(updatedBlog);
  }

  async deleteBlogByIdxAndMemberId(idx: number, memberId: string): Promise<boolean> {
    const blog = await prisma.blog.findFirst({
      where: { idx, memberId }
    });

    if (!blog) {
      return false;
    }

    await prisma.blog.delete({
      where: { idx }
    });

    return true;
  }


  // DB 데이터를 BlogCategoryItem으로 변환
  private changeToBlogCategoryItem(dbRow: BlogCategoryRow): BlogCategoryItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      categoryName: dbRow.categoryName,
      order: dbRow.order,
    };
  }

  // 특정 사용자의 모든 카테고리 조회
  async getCategoriesByMemberId(memberId: string): Promise<BlogCategoryItem[]> {
    const categories = await prisma.blogCategory.findMany({
      where: { memberId },
      orderBy: {
        order: 'asc' // 순서대로 정렬
      }
    });

    return categories.map((category: BlogCategoryRow) => this.changeToBlogCategoryItem(category));
  }

  // 카테고리 추가
  async createCategory(data: CreateBlogCategoryRequest): Promise<BlogCategoryItem> {
    const category = await prisma.blogCategory.create({
      data: {
        memberId: data.memberId,
        categoryName: data.categoryName,
        order: data.order,
      }
    });

    return this.changeToBlogCategoryItem(category);
  }

  async updateCategoryByIdxAndMemberId(
    memberId: string,
    data: UpdateBlogCategoryRequest
  ): Promise<BlogCategoryItem | null> {
    const category = await prisma.blogCategory.findFirst({
      where: { idx: data.idx, memberId }
    });

    if (!category) {
      return null;
    }

    const updatedCategory = await prisma.blogCategory.update({
      where: { idx: data.idx },
      data: {
        categoryName: data.categoryName,
        order: data.order,
      }
    });

    return this.changeToBlogCategoryItem(updatedCategory);
  }

  async deleteCategoryByIdxAndMemberId(idx: number, memberId: string): Promise<boolean> {
    const category = await prisma.blogCategory.findFirst({
      where: { idx, memberId }
    });

    if (!category) {
      return false;
    }

    await prisma.blogCategory.delete({
      where: { idx }
    });

    return true;
  }
}

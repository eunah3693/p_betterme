import { prisma } from '@/lib/prisma';
import { BlogItem } from '@/interfaces/blog';
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
  async createBlog(data: {
    memberId: string;
    subject: string;
    content: string;
    date: Date;
  }): Promise<BlogItem> {
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
  async updateBlog(idx: number, data: {
    subject?: string;
    content?: string;
    date?: Date;
  }): Promise<BlogItem> {
    const blog = await prisma.blog.update({
      where: { idx },
      data
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
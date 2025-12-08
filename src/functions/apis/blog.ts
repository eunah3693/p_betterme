import { axiosInstance } from './axios';
import { BlogItem, BlogListResponse, BlogResponse, CreateBlogRequest, UpdateBlogRequest } from '@/interfaces/blog';

const BLOG_URL = '/api/blog';

// 모든 블로그 조회
export const getAllBlogs = async (): Promise<BlogListResponse> => {
  try {
    const { data } = await axiosInstance.get<BlogListResponse>(BLOG_URL);
    return data;
  } catch (error) {
    console.error('블로그 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 블로그 조회
export const getBlogByIdx = async (idx: number): Promise<BlogResponse> => {
  try {
    const { data } = await axiosInstance.get<BlogResponse>(`${BLOG_URL}/${idx}`);
    return data;
  } catch (error) {
    console.error('블로그 조회 실패:', error);
    throw error;
  }
};

// 블로그 등록
export const createBlog = async (
  blogData: CreateBlogRequest
): Promise<{ success: boolean; data: BlogItem; message?: string }> => {
  try {
    const { data } = await axiosInstance.post<{ success: boolean; data: BlogItem; message?: string }>(
      `${BLOG_URL}/register`,
      blogData
    );
    return data;
  } catch (error) {
    console.error('블로그 등록 실패:', error);
    throw error;
  }
};

// 블로그 수정
export const updateBlog = async (
  blogData: UpdateBlogRequest
): Promise<{ success: boolean; data: BlogItem; message?: string }> => {
  try {
    const { idx, ...body } = blogData;
    const { data } = await axiosInstance.put<{ success: boolean; data: BlogItem; message?: string }>(
      `${BLOG_URL}/${idx}/update`,
      body
    );
    return data;
  } catch (error) {
    console.error('블로그 수정 실패:', error);
    throw error;
  }
};

// 블로그 삭제
export const deleteBlog = async (idx: number) => {
  try {
    const { data } = await axiosInstance.delete(`${BLOG_URL}/${idx}/delete`);
    return data;
  } catch (error) {
    console.error('블로그 삭제 실패:', error);
    throw error;
  }
};


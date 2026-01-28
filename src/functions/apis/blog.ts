import { axiosInstance } from './axios';
import { BlogItem, BlogListRequest, BlogListResponse, BlogResponse, CreateBlogRequest, UpdateBlogRequest } from '@/interfaces/blog';

const BLOG_URL = '/api/blog';
const MY_BLOG_URL = '/api/blog/myblog';
const MONTHLY_BLOG_URL = '/api/blog/monthly';
const RECOMMENDED_BLOG_URL = '/api/blog/recommended';
const MOST_VIEWED_BLOG_URL = '/api/blog/mostviewed';

// 이달의 블로그 조회
export const getMonthlyBlogs = async (params: BlogListRequest): Promise<BlogListResponse> => {
  try {
    const { data } = await axiosInstance.post<BlogListResponse>(MONTHLY_BLOG_URL, { page : params.page });
    return data;
  } catch (error) {
    console.error('블로그 목록 조회 실패:', error);
    throw error;
  }
};

// 추천 블로그 조회
export const getRecommendedBlogs = async (params: BlogListRequest): Promise<BlogListResponse> => {
  try {
    const { data } = await axiosInstance.post<BlogListResponse>(RECOMMENDED_BLOG_URL, { page : params.page });
    return data;
  } catch (error) {
    console.error('블로그 목록 조회 실패:', error);
    throw error;
  }
};

// 많이본 블로그 조회
export const getMostViewedBlogs = async (params: BlogListRequest): Promise<BlogListResponse> => {
  try {
    const { data } = await axiosInstance.post<BlogListResponse>(MOST_VIEWED_BLOG_URL, { page : params.page });
    return data;
  } catch (error) {
    console.error('블로그 목록 조회 실패:', error);
    throw error;
  }
};

// 내 블로그 조회 
export const getMyBlogs = async ( params: BlogListRequest ): Promise<BlogListResponse> => {
  try {
    const { data } = await axiosInstance.post<BlogListResponse>(MY_BLOG_URL, { page: params.page, categoryIdx: params.categoryIdx });
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
    console.log('🔍 블로그 수정 결과:', data);
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


const CATEGORY_URL = '/api/blog/category';

// 카테고리 목록 조회
export const getCategories = async (memberId: string) => {
  try {
    const { data } = await axiosInstance.get(`${CATEGORY_URL}?memberId=${memberId}`);
    return data;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    throw error;
  }
};

// 카테고리 추가
export const createCategory = async (categoryData: {
  memberId: string;
  categoryName: string;
  order: number;
}) => {
  try {
    const { data } = await axiosInstance.post(`${CATEGORY_URL}/register`, categoryData);
    return data;
  } catch (error) {
    console.error('카테고리 추가 실패:', error);
    throw error;
  }
};

// 카테고리 수정
export const updateCategory = async (categoryData: {
  idx: number;
  categoryName: string;
  order: number;
}) => {
  try {
    const { data } = await axiosInstance.put(`${CATEGORY_URL}/update`, categoryData);
    return data;
  } catch (error) {
    console.error('카테고리 수정 실패:', error);
    throw error;
  }
};

// 카테고리 삭제
export const deleteCategory = async (idx: number) => {
  try {
    const { data } = await axiosInstance.delete(`${CATEGORY_URL}/delete?idx=${idx}`);
    return data;
  } catch (error) {
    console.error('카테고리 삭제 실패:', error);
    throw error;
  }
};


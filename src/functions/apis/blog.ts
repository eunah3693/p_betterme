import { BlogItem, BlogListRequest, BlogListResponse, BlogResponse, CreateBlogRequest, UpdateBlogRequest, BlogCategoryResponse } from '@/interfaces/blog';
import { api } from './fetch';

const BLOG_URL = '/api/blog';
const MY_BLOG_URL = '/api/blog/myblog';
const MONTHLY_BLOG_URL = '/api/blog/monthly';
const RECOMMENDED_BLOG_URL = '/api/blog/recommended';
const MOST_VIEWED_BLOG_URL = '/api/blog/mostviewed';
const CATEGORY_URL = '/api/blog/category';


export const fetchMonthlyBlogs = (page = 0) => 
  api.post<BlogListResponse>(MONTHLY_BLOG_URL, { page }, true);

export const fetchRecommendedBlogs = (page = 0) => 
  api.post<BlogListResponse>(RECOMMENDED_BLOG_URL, { page }, true);

export const fetchMostViewedBlogs = (page = 0) => 
  api.post<BlogListResponse>(MOST_VIEWED_BLOG_URL, { page }, true);


export const getMonthlyBlogs = (params: BlogListRequest) => 
  api.post<BlogListResponse>(MONTHLY_BLOG_URL, { page: params.page });

export const getRecommendedBlogs = (params: BlogListRequest) => 
  api.post<BlogListResponse>(RECOMMENDED_BLOG_URL, { page: params.page });

export const getMostViewedBlogs = (params: BlogListRequest) => 
  api.post<BlogListResponse>(MOST_VIEWED_BLOG_URL, { page: params.page });

export const getMyBlogs = (params: BlogListRequest) => 
  api.post<BlogListResponse>(MY_BLOG_URL, { 
    page: params.page, 
    categoryIdx: params.categoryIdx 
  });

export const getBlogByIdx = (idx: number) => 
  api.get<BlogResponse>(`${BLOG_URL}/${idx}`);

export const createBlog = (blogData: CreateBlogRequest) => 
  api.post<{ success: boolean; data: BlogItem; message?: string }>(
    `${BLOG_URL}/register`,
    blogData
  );

export const updateBlog = async (blogData: UpdateBlogRequest) => {
  const { idx, ...body } = blogData;
  const result = await api.put<{ success: boolean; data: BlogItem; message?: string }>(
    `${BLOG_URL}/${idx}/update`,
    body
  );
  return result;
};

export const deleteBlog = (idx: number) => 
  api.delete(`${BLOG_URL}/${idx}/delete`);

export const getCategories = (memberId: string): Promise<BlogCategoryResponse> => 
  api.get(`${CATEGORY_URL}`, { memberId });

export const createCategory = (categoryData: {
  memberId: string;
  categoryName: string;
  order: number;
}) => api.post(`${CATEGORY_URL}/register`, categoryData);

export const updateCategory = (categoryData: {
  idx: number;
  categoryName: string;
  order: number;
}) => api.put(`${CATEGORY_URL}/update`, categoryData);

export const deleteCategory = (idx: number) => 
  api.delete(`${CATEGORY_URL}/delete`, { idx });


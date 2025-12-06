import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Button from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import { getAllBlogs } from '@/functions/apis/blog';
import type { BlogItem } from '@/interfaces/blog';

const BlogListPage = () => {
  const router = useRouter();

  const {
    data: blogList = [],
    isLoading,
    error,
    refetch
  } = useQuery<BlogItem[], Error>({
    queryKey: ['blogs'],
    queryFn: async (): Promise<BlogItem[]> => {
      const result = await getAllBlogs();

      if (!result.success || !result.data) {
        throw new Error('Failed to fetch blogs');
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    retry: 2, 
  });

  const handleCardClick = (idx: number) => {
    router.push(`/blog/${idx}`);
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">

          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">블로그</h1>
              <p className="text-gray-600">다양한 이야기를 공유합니다</p>
            </div>
            <Button
              onClick={() => router.push('/blog/register')}
              color="bgMain"
              size="md"
              className="hover:bg-main/90 transition-colors whitespace-nowrap"
            >
              글쓰기
            </Button>
          </div>

          {error ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : blogList.length === 0 ? (
            <NoContent message="등록된 블로그가 없습니다." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogList.map((blog) => (
                <Card
                  key={blog.idx}
                  data={blog}
                  onClick={() => handleCardClick(blog.idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;


import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import BlogView from '@/components/Blog/ViewContent';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import { getBlogByIdx } from '@/functions/apis/blog';
import type { BlogItem } from '@/interfaces/blog';
import { useUserStore } from '@/store/user';

const BlogDetailPage = () => {
  const router = useRouter();
  const { idx } = router.query;
  const user = useUserStore((state) => state.user);

  const {
    data: blogData,
    isLoading,
    error,
    refetch
  } = useQuery<BlogItem | null, Error>({
    queryKey: ['blog', idx],
    queryFn: async (): Promise<BlogItem | null> => {
      if (!idx) return null;

      const result = await getBlogByIdx(Number(idx));

      if (!result.success || !result.data) {
        return null;
      }

      if (Array.isArray(result.data)) {
        return result.data[0] || null;
      }

      return result.data as BlogItem;
    },
    enabled: !!idx, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    retry: 2,
  });

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {error || !blogData ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : (
            <>
              <BlogView 
                data={blogData}
                type="blog"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;


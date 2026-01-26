import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import Button from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import { getMyBlogs } from '@/functions/apis/blog';
import type { BlogItem, BlogListResponse } from '@/interfaces/blog';

const BlogListPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data: blogListData,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BlogListResponse>({
    queryKey: ['myblog', id],
    queryFn: ({ pageParam = 0 }) => getMyBlogs({ page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.page) return undefined;
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  // 무한스크롤 감지
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const blogList = blogListData?.pages.flatMap(page => page.data) || [];

  const handleCardClick = (idx: number) => {
    router.push(`/blog/${idx}`);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">

          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2"> {id}님의 블로그</h1>
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
          ) : blogList.length === 0 && !isLoading ? (
            <NoContent message="등록된 블로그가 없습니다." />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogList.map((blog: BlogItem) => (
                  <Card
                    key={blog.idx}
                    data={blog}
                    onClick={() => handleCardClick(blog.idx)}
                  />
                ))}
              </div>
              
              {/* 무한스크롤 로딩 표시 */}
              {isFetchingNextPage && (
                <div className="py-20 text-center text-gray-500">불러오는 중...</div>
              )}
              
              {/* 무한스크롤 감지 영역 */}
              <div ref={loaderRef} className="h-8" />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogListPage;


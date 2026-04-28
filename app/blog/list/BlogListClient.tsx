'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import {
  fetchMonthlyBlogs,
  fetchRecommendedBlogs,
  fetchMostViewedBlogs,
} from '@/functions/apis/blog';
import type { BlogItem, BlogListResponse } from '@/interfaces/blog';

type BlogListType = 'monthly' | 'recommended' | 'mostviewed';

const blogQueryMap: Record<BlogListType, (page?: number) => Promise<BlogListResponse>> = {
  monthly: fetchMonthlyBlogs,
  recommended: fetchRecommendedBlogs,
  mostviewed: fetchMostViewedBlogs,
};

const blogTitleMap: Record<BlogListType, string> = {
  monthly: '이달의 블로그',
  recommended: '추천 블로그',
  mostviewed: '많이 본 블로그',
};

const isBlogListType = (value?: string | null): value is BlogListType =>
  value === 'monthly' || value === 'recommended' || value === 'mostviewed';

export default function BlogListClient() {
  const searchParams = useSearchParams();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const hasNextPageRef = useRef(false);
  const isFetchingNextPageRef = useRef(false);
  const isFetchingNextPageLockedRef = useRef(false);
  const typeParam = searchParams.get('type');
  const blogType: BlogListType = isBlogListType(typeParam) ? typeParam : 'monthly';

  const {
    data: blogListData,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BlogListResponse>({
    queryKey: ['blogs', blogType],
    queryFn: ({ pageParam = 0 }) => blogQueryMap[blogType](pageParam as number),
    getNextPageParam: (lastPage) => {
      if (!lastPage.page) return undefined;
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  useEffect(() => {
    hasNextPageRef.current = Boolean(hasNextPage);
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  //스크롤시 fetch
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          !entry.isIntersecting ||
          !hasNextPageRef.current ||
          isFetchingNextPageRef.current ||
          isFetchingNextPageLockedRef.current
        ) {
          return;
        }

        isFetchingNextPageLockedRef.current = true;
        void fetchNextPage().finally(() => {
          isFetchingNextPageLockedRef.current = false;
        });
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage]);

  //data 중복방지
  const blogList = blogListData?.pages.flatMap((page) => page.data) || [];


  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          <div className="mb-8 md:flex justify-between items-end pt-10 md:pt-0">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-main mb-2">
                {blogTitleMap[blogType]}
              </h1>
            </div>
          </div>

          {error ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : blogList.length === 0 && !isLoading ? (
            <NoContent message="등록된 블로그가 없습니다." />
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogList.map((blog: BlogItem) => (
                  <Card key={blog.idx} data={blog} url={'/blog/' + blog.idx} />
                ))}
              </div>

              {isFetchingNextPage && (
                <div className="py-20 text-center text-gray-500">
                  불러오는 중...
                </div>
              )}

              <div ref={loaderRef} className="h-8" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

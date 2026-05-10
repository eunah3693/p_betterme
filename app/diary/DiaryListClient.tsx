'use client';

import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import ErrorMessage from '@/components/Error/ErrorMessage';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import { fetchDiaries, getNextDiaryPageParam } from '@/functions/apis/diary';
import type { DiaryItem, DiaryListResponse } from '@/interfaces/diary';

export default function DiaryListClient() {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data: diaryListData,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<DiaryListResponse>({
    queryKey: ['diary'],
    queryFn: ({ pageParam = 0 }) => fetchDiaries(pageParam as number),
    getNextPageParam: getNextDiaryPageParam,
    initialPageParam: 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || !hasNextPage || isFetchingNextPage) {
          return;
        }

        void fetchNextPage({ cancelRefetch: false });
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const diaryList = diaryListData?.pages.flatMap((page) => page.data) || [];

  if (error) {
    return <ErrorMessage onRetry={() => refetch()} />;
  }

  if (diaryList.length === 0 && !isLoading) {
    return <NoContent message="작성된 일기가 없습니다." />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {diaryList.map((diary: DiaryItem) => (
          <Card key={diary.idx} data={diary} url={'/diary/' + diary.idx} />
        ))}
      </div>

      <div ref={loaderRef} className="h-8" />
    </div>
  );
}

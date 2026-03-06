import React from 'react';
import BlogListClient from './BlogListClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchMonthlyBlogs, fetchRecommendedBlogs, fetchMostViewedBlogs } from '@/functions/apis/blog';

// revalidate: 0 / no-store fetch 사용으로 빌드 시 정적 생성 불가 → 동적 렌더링으로 처리
export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['blogs', 'monthly', 0],
      queryFn: () => fetchMonthlyBlogs(0),
    }),
    queryClient.prefetchQuery({
      queryKey: ['blogs', 'recommended', 0],
      queryFn: () => fetchRecommendedBlogs(0),
    }),
    queryClient.prefetchQuery({
      queryKey: ['blogs', 'mostviewed', 0],
      queryFn: () => fetchMostViewedBlogs(0),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogListClient />
    </HydrationBoundary>
  );
}

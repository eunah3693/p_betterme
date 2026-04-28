import React from 'react';
import BlogListClient from './BlogListClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  fetchMonthlyBlogs,
  fetchRecommendedBlogs,
  fetchMostViewedBlogs,
} from '@/functions/apis/blog';

type BlogListType = 'monthly' | 'recommended' | 'mostviewed';

const blogQueryMap: Record<BlogListType, (page?: number) => Promise<unknown>> = {
  monthly: fetchMonthlyBlogs,
  recommended: fetchRecommendedBlogs,
  mostviewed: fetchMostViewedBlogs,
};

const isBlogListType = (value?: string): value is BlogListType =>
  value === 'monthly' || value === 'recommended' || value === 'mostviewed';

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const queryClient = new QueryClient();
  const { type } = await searchParams;
  const blogType: BlogListType = isBlogListType(type) ? type : 'monthly';

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['blogs', blogType],
    queryFn: ({ pageParam = 0 }) => blogQueryMap[blogType](pageParam as number),
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogListClient />
    </HydrationBoundary>
  );
}

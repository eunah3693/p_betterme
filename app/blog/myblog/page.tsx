import React from 'react';
import MyBlogClient from './MyBlogClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getMyBlogs, getCategories } from '@/functions/apis/blog';

export default async function MyBlogPage({
  searchParams,
}: {
  searchParams: { id?: string; category?: string };
}) {
  const queryClient = new QueryClient();
  const { id, category } = searchParams;

  if (id) {
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        queryKey: ['myblog', id, category ? Number(category) : null],
        queryFn: () => getMyBlogs({ 
          page: 0,
          categoryIdx: category ? Number(category) : null
        }),
        initialPageParam: 0,
      }),
      queryClient.prefetchQuery({
        queryKey: ['categories', id],
        queryFn: () => getCategories(id),
      }),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyBlogClient />
    </HydrationBoundary>
  );
}

import React from 'react';
import BlogDetailClient from './BlogDetailClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getBlogByIdx } from '@/functions/apis/blog';

export default async function BlogDetailPage({
  params,
}: {
  params: { idx: string };
}) {
  const queryClient = new QueryClient();
  const { idx } = params;

  await queryClient.prefetchQuery({
    queryKey: ['blog', idx],
    queryFn: async () => {
      if (!idx) return null;

      const result = await getBlogByIdx(Number(idx));

      if (!result.success || !result.data) {
        return null;
      }

      if (Array.isArray(result.data)) {
        return result.data[0] || null;
      }

      return result.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetailClient idx={idx} />
    </HydrationBoundary>
  );
}

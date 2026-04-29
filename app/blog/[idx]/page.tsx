import type { Metadata } from 'next';
import React from 'react';
import BlogDetailClient from './BlogDetailClient';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getBlogByIdx } from '@/functions/apis/blog';

const getPlainText = (html?: string | null) =>
  html?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || '';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idx: string }>;
}): Promise<Metadata> {
  const { idx } = await params;
  const result = await getBlogByIdx(Number(idx));

  if (!result.success || !result.data) {
    return {
      title: '블로그 글을 찾을 수 없습니다 | Better Me',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const blog = Array.isArray(result.data) ? result.data[0] : result.data;
  const title = blog?.subject || 'Better Me 블로그';
  const description =
    getPlainText(blog?.content).slice(0, 150) ||
    'Better Me의 자기개발 블로그 글입니다.';

  return {
    title: `${title} | Better Me`,
    description,
    alternates: {
      canonical: `/blog/${idx}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/${idx}`,
      type: 'article',
      publishedTime: blog?.date || undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ idx: string }>;
}) {
  const queryClient = new QueryClient();
  const { idx } = await params;

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

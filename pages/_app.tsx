import type { AppProps } from 'next/app';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isProduction } from "@/functions/utils/commons";
import { useUserStore } from '@/store/user';
import Layout from './layout';

import '@/styles/global.css';

// 로그인 없이 접근 가능한 공개 페이지 목록
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/blog',
  '/blog/myblog'
];

export default function MyApp({
  Component,
  pageProps,
}: AppProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  // 보호된 페이지 접근 시 로그인 체크
  useEffect(() => {
    // hydration이 완료될 때까지 기다림
    if (!hasHydrated) return;
    
    // 정확히 일치하는 경로 또는 /blog로 시작하는 모든 경로는 공개
    const isPublicPath = PUBLIC_PATHS.includes(router.pathname) || router.pathname.startsWith('/blog');
    
    if (!isPublicPath && !user) {
      router.push('/login');
    }
  }, [router, user, hasHydrated]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5분
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ReactQueryDevtools
          initialIsOpen={!isProduction()}
        />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

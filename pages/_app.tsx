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

import '@/styles/global.css';

// 로그인 없이 접근 가능한 공개 페이지 목록
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/',  // 홈페이지도 공개
];

export default function MyApp({
  Component,
  pageProps,
}: AppProps) {
  const router = useRouter();
  const checkAuth = useUserStore((state) => state.checkAuth);
  const user = useUserStore((state) => state.user);

  // 보호된 페이지 접근 시 로그인 체크
  useEffect(() => {
    const isPublicPath = PUBLIC_PATHS.includes(router.pathname);
    
    if (!isPublicPath && !user) {
      router.push('/login');
    }
  }, [router.pathname, user]);

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
        <Component {...pageProps} />
        <ReactQueryDevtools
          initialIsOpen={!isProduction()}
        />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

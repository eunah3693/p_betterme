import type { AppProps } from 'next/app';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState, useEffect } from 'react';
import { isProduction } from "@/functions/utils/commons";
import { useUserStore } from '@/store/user';

import '@/styles/global.css';

export default function MyApp({
  Component,
  pageProps,
}: AppProps) {
  const { checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


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

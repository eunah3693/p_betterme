'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NavBar from '@/components/NavBar';
import AuthGuard from './AuthGuard';
import { isProduction } from "@/functions/utils/commons";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
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
      <div className="font-notoSans min-h-screen bg-gray-50">
        <NavBar />
        <AuthGuard>
          {children}
        </AuthGuard>
      </div>
      <ReactQueryDevtools initialIsOpen={!isProduction()} />
    </QueryClientProvider>
  );
}

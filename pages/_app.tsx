import type { AppProps } from 'next/app';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import React, { useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import {isProduction} from "@/functions/utils/commons";

import '@/styles/global.css';

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        {/*<GlobalStyle />*/}
        <Component {...pageProps} />
        {/*<FloatingButton />*/}
        <ReactQueryDevtools
          initialIsOpen={!isProduction()}
          position="bottom-right"
        />
      </Hydrate>
    </QueryClientProvider>
  );
}

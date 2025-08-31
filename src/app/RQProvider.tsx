'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = { children: ReactNode };
interface ErrorType extends Error {
  resultCode: number;
  message: string;
}

const handleError = (error: any) => {
  const typedError = error as ErrorType;
  // if ([401, 403, 404, 500, 'Network Error'].includes(typedError.resultCode)) {
  //   throw new Error(`${typedError.message}`);
  // }
  return false;
};

export default function Providers({ children }: Props) {
  // QueryClient를 컴포넌트 내부에서 생성하되, useMemo로 캐시하여 재생성 방지
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retryOnMount: true,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 60 * 1000,
            gcTime: 300 * 1000,
            throwOnError: (error) => handleError(error),
          },
          mutations: {
            throwOnError: (error) => handleError(error),
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

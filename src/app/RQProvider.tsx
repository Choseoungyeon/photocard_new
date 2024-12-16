'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = { children: ReactNode };
interface ErrorType extends Error {
  resultCode: number;
  message: string;
}

export default function Providers({ children }: Props) {
  const queryClient = new QueryClient({
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
  });

  const handleError = (error: any) => {
    const typedError = error as ErrorType;
    if ([401, 403, 404, 500, 'Network Error'].includes(typedError.resultCode)) {
      throw new Error(`${typedError.message}`);
    }
    return false;
  };

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

import React from 'react';
import CreateClient from './CreateClient';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';

async function getStickers({
  pageParam,
}: {
  pageParam?: { lastIndex?: number; direction: 'next' | 'prev' };
}) {
  const params = new URLSearchParams({
    limit: '20',
  });

  if (pageParam?.lastIndex !== undefined) {
    params.append('last_index', pageParam.lastIndex.toString());
    params.append('direction', pageParam.direction);
  }

  const response = await customFetch.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/image?${params}`,
  );

  return response.data;
}

export default async function Create() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['stickers'],
    queryFn: getStickers,
    initialPageParam: { lastIndex: undefined, direction: 'next' as const },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateClient />
    </HydrationBoundary>
  );
}

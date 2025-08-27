import React from 'react';
import CreateClient from './CreateClient';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';

async function getImagePhoto(type: 'Sticker' | 'Ribbon') {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/image/${type}`;
  const res = await customFetch.get(url);
  return res.data.images;
}

export default async function Create() {
  const queryClient = new QueryClient();

  // TanStack Query를 사용하여 서버에서 prefetch
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['sticker-images'],
      queryFn: () => getImagePhoto('Sticker'),
    }),
    queryClient.prefetchQuery({
      queryKey: ['ribbon-images'],
      queryFn: () => getImagePhoto('Ribbon'),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CreateClient />
    </HydrationBoundary>
  );
}

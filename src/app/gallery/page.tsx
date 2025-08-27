import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';
import GalleryClient from './GalleryClient';
import Loading from '@/app/_component/Loading';

async function getPhotocards({ pageParam }: { pageParam?: string }) {
  const params = new URLSearchParams({
    limit: '10',
  });

  if (pageParam) {
    params.append('last_id', pageParam);
    params.append('direction', 'next');
  }

  const response = await customFetch.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/album?${params}`,
  );

  const photocards = response.data.productInfo;
  const hasNextPage = response.data.pagination.hasNextPage;
  const totalCount = response.data.pagination.totalCount;

  return {
    data: photocards,
    nextPage: hasNextPage ? response.data.pagination.nextCursor : undefined,
    totalCount,
  };
}

export default async function GalleryPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['photocards'],
    queryFn: getPhotocards,
    initialPageParam: undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <GalleryClient />
      </Suspense>
    </HydrationBoundary>
  );
}

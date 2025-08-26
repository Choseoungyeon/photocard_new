import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';
import GalleryClient from './GalleryClient';
import Loading from '@/app/_component/Loading';

interface Photocard {
  _id: string;
  writer: {
    _id: string;
    name: string;
    email: string;
  };
  images: {
    [key: string]: string;
  };
  title: string;
  description: string;
  createdAt: string;
}

async function preloadImages(imageUrls: string[]): Promise<void> {
  if (imageUrls.length === 0) return;

  const imagePromises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = url;
    });
  });

  await Promise.allSettled(imagePromises);
}

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

  const imageUrls = photocards.map((card: Photocard) => card.images.main);
  await preloadImages(imageUrls);

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

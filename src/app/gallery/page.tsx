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

// 서버에서 데이터를 미리 fetch하는 함수
async function getPhotocards({ pageParam }: { pageParam?: string }) {
  // 실제 API 호출 (커서 기반 페이지네이션)
  const params = new URLSearchParams({
    limit: '10', // 한 번에 10개씩 가져오기
  });

  // 커서가 있으면 추가
  if (pageParam) {
    params.append('last_id', pageParam);
    params.append('direction', 'next');
  }

  const response = await customFetch.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/album?${params}`,
  );

  const photocards = response.data.productInfo;
  const hasNextPage = response.data.pagination.hasNextPage;

  return {
    data: photocards,
    nextPage: hasNextPage ? response.data.pagination.nextCursor : undefined,
  };
}

export default async function GalleryPage() {
  const queryClient = new QueryClient();

  // 서버에서 데이터를 미리 fetch (첫 페이지만)
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

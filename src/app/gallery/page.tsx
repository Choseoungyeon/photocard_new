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

// 이미지들을 미리 로드하는 함수
async function preloadImages(imageUrls: string[]): Promise<void> {
  if (imageUrls.length === 0) return;

  const imagePromises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // 에러가 나도 계속 진행
      img.src = url;
    });
  });

  // 모든 이미지를 병렬로 로드하되, 일부가 실패해도 계속 진행
  await Promise.allSettled(imagePromises);
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

  // 이미지 URL들을 추출하여 미리 로드
  const imageUrls = photocards.map((card: Photocard) => card.images.main);
  await preloadImages(imageUrls);

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

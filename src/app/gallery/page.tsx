import { Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { auth } from '@/auth';
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

// 더미 데이터 생성
const dummyPhotocards: Photocard[] = [
  {
    _id: '1',
    writer: {
      _id: 'user1',
      name: '사용자1',
      email: 'user1@example.com',
    },
    images: {
      main: 'https://res.cloudinary.com/debdoulmp/image/upload/v1755923272/IMG/Photocard/jmov5v41lv3rcvi7uern.png',
    },
    title: '첫 번째 포토카드',
    description: '이것은 내가 만든 첫 번째 포토카드입니다. 아름다운 추억을 담았어요.',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    writer: {
      _id: 'user1',
      name: '사용자1',
      email: 'user1@example.com',
    },
    images: {
      main: 'https://res.cloudinary.com/debdoulmp/image/upload/v1755923272/IMG/Photocard/jmov5v41lv3rcvi7uern.png',
    },
    title: '여행의 추억',
    description: '제주도 여행에서 찍은 아름다운 풍경. 푸른 바다와 하얀 구름이 인상적이었어요.',
    createdAt: '2024-01-20T14:20:00Z',
  },
  {
    _id: '3',
    writer: {
      _id: 'user1',
      name: '사용자1',
      email: 'user1@example.com',
    },
    images: {
      main: 'https://res.cloudinary.com/debdoulmp/image/upload/v1755923272/IMG/Photocard/jmov5v41lv3rcvi7uern.png',
    },
    title: '친구들과의 시간',
    description: '오랜만에 만난 친구들과 함께한 즐거운 시간. 웃음이 끊이지 않았던 하루였습니다.',
    createdAt: '2024-01-25T18:45:00Z',
  },
  {
    _id: '4',
    writer: {
      _id: 'user1',
      name: '사용자1',
      email: 'user1@example.com',
    },
    images: {
      main: 'https://res.cloudinary.com/debdoulmp/image/upload/v1755923272/IMG/Photocard/jmov5v41lv3rcvi7uern.png',
    },
    title: '일상의 아름다움',
    description: '평범한 일상 속에서 발견한 작은 아름다움. 커피 한 잔과 함께한 여유로운 오후.',
    createdAt: '2024-02-01T12:15:00Z',
  },
  {
    _id: '5',
    writer: {
      _id: 'user1',
      name: '사용자1',
      email: 'user1@example.com',
    },
    images: {
      main: 'https://res.cloudinary.com/debdoulmp/image/upload/v1755923272/IMG/Photocard/jmov5v41lv3rcvi7uern.png',
    },
    title: '자연의 선물',
    description: '산책 중에 만난 아름다운 꽃들. 봄의 기운이 가득한 순간을 담았습니다.',
    createdAt: '2024-02-05T09:30:00Z',
  },
  {
    _id: '6',
    writer: {
      _id: 'user1',
      name: '사용자1',
      email: 'user1@example.com',
    },
    images: {
      main: 'https://res.cloudinary.com/debdoulmp/image/upload/v1755923272/IMG/Photocard/jmov5v41lv3rcvi7uern.png',
    },
    title: '도시의 밤',
    description: '도시의 야경을 담은 포토카드. 반짝이는 불빛들이 마치 별처럼 보였어요.',
    createdAt: '2024-02-10T20:00:00Z',
  },
];

// 서버에서 데이터를 미리 fetch하는 함수
async function getPhotocards() {
  try {
    const session = await auth();
    if (!session) {
      return dummyPhotocards; // 인증되지 않아도 더미 데이터 반환
    }

    // 실제 API 호출 (백엔드 album 엔드포인트 사용)
    const params = new URLSearchParams({
      limit: '10', // 한 번에 10개씩 가져오기
      skip: '0',
    });
    const response = await customFetch.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/album?${params}`,
    );
    return response.data.productInfo; // 백엔드 응답 구조에 맞춤

    // 더미 데이터 반환 (실제 API처럼 지연 시간 추가)
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // return dummyPhotocards;
  } catch (error) {
    console.error('서버에서 포토카드 fetch 실패:', error);
    return dummyPhotocards; // 에러 시에도 더미 데이터 반환
  }
}

export default async function GalleryPage() {
  const queryClient = new QueryClient();

  // 서버에서 데이터를 미리 fetch
  await queryClient.prefetchQuery({
    queryKey: ['photocards'],
    queryFn: getPhotocards,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loading />}>
        <GalleryClient />
      </Suspense>
    </HydrationBoundary>
  );
}

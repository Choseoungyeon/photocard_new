'use client';

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiTrash2, FiEdit3, FiGrid } from 'react-icons/fi';
import Button from '../_component/Button';
import Card from '../_component/Card';
import Skeleton from '../_component/Skeleton';
import customFetch from '../_hook/customFetch';
import { formatDate } from './utils';
import '../style/page/gallery.scss';

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

export default function GalleryClient() {
  const router = useRouter();
  const [titleSearch, setTitleSearch] = React.useState('');
  const [isSelectMode, setIsSelectMode] = React.useState(false);

  // 이미지들을 미리 로드하는 함수
  const preloadImages = React.useCallback(async (imageUrls: string[]): Promise<void> => {
    if (imageUrls.length === 0) return;

    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // 에러가 나도 계속 진행
        img.src = url;
      });
    });

    // 모든 이미지를 병렬로 로드하되, 일부가 실패해도 계속 진행
    await Promise.allSettled(imagePromises);
  }, []);

  // 포토카드 목록 조회 (무한 스크롤)
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: titleSearch ? ['photocards', titleSearch] : ['photocards'],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          limit: '10',
        });

        // 커서가 있으면 추가
        if (pageParam) {
          params.append('last_id', pageParam as string);
          params.append('direction', 'next');
        }

        if (titleSearch) {
          params.append('title', titleSearch);
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
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 5 * 60 * 1000,
      // placeholderData: (previousData) => previousData, // 이전 데이터 유지
    });

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const photocards = data?.pages.flatMap((page) => page.data) || [];

  // 백엔드에서 검색된 포토카드 사용 (클라이언트 필터링 제거)
  const filteredPhotocards = photocards || [];

  // 무한 스크롤 처리
  const handleScroll = React.useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    // 실제 포토카드 요소들만 찾기 (스켈레톤 제외)
    const cardElements = document.querySelectorAll('.gallery__card-wrapper:not(.skeleton)');
    if (cardElements.length === 0) return;

    const lastCard = cardElements[cardElements.length - 1];
    const lastCardRect = lastCard.getBoundingClientRect();
    const lastCardBottom = lastCardRect.bottom;

    // 마지막 카드의 bottom이 스크린 끝에서 100px 전에 도달하면 다음 페이지 로드
    if (lastCardBottom <= window.innerHeight + 100) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 스켈레톤 카드들 생성
  const skeletonCards = Array.from({ length: 6 }).map((_, index) => (
    <div key={`skeleton-${index}`} className="gallery__card-wrapper skeleton">
      <Skeleton className="gallery__card" />
    </div>
  ));

  return (
    <div className="gallery">
      {/* 헤더 */}
      <header className="gallery__header">
        <div className="gallery__header-content">
          <div className="gallery__header-left">
            <h1 className="gallery__title">내 포토카드 갤러리</h1>
            <p className="gallery__subtitle">{photocards?.length || 0}개의 포토카드가 있습니다</p>
          </div>
          <div className="gallery__header-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={() => router.push('/create')}
              className="gallery__create-btn"
            >
              <FiPlus />새 포토카드 만들기
            </Button>
          </div>
        </div>
      </header>

      {/* 툴바 */}
      <div className="gallery__toolbar">
        <div className="gallery__toolbar-left">
          {/* 검색 */}
          <div className="gallery__search">
            <FiSearch className="gallery__search-icon" />
            <input
              type="text"
              placeholder="포토카드 검색..."
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              className="gallery__search-input"
            />
          </div>
        </div>
      </div>

      {/* 포토카드 그리드 */}
      <div className="gallery__content">
        {error ? (
          <div className="gallery__error">
            <p>포토카드를 불러오는 중 오류가 발생했습니다.</p>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        ) : isLoading ? (
          <div className="gallery__grid">{skeletonCards}</div>
        ) : filteredPhotocards.length === 0 ? (
          <div className="gallery__empty">
            <div className="gallery__empty-icon">
              <FiGrid />
            </div>
            <h3 className="gallery__empty-title">
              {titleSearch ? '검색 결과가 없습니다' : '아직 포토카드가 없습니다'}
            </h3>
            <p className="gallery__empty-subtitle">
              {titleSearch ? '다른 검색어를 시도해보세요' : '첫 번째 포토카드를 만들어보세요'}
            </p>
            {!titleSearch && (
              <Button
                variant="primary"
                onClick={() => router.push('/create')}
                className="gallery__empty-btn"
              >
                <FiPlus />
                포토카드 만들기
              </Button>
            )}
          </div>
        ) : (
          <div className="gallery__grid">
            {filteredPhotocards.map((card: Photocard) => (
              <div key={card._id} className={`gallery__card-wrapper`}>
                <Card className="gallery__card">
                  <div className="gallery__card-image">
                    <img src={card.images.main} alt={card.title} />
                  </div>
                  <div className="gallery__card-content">
                    <h3 className="gallery__card-title">{card.title}</h3>
                    <p className="gallery__card-text">{card.description}</p>
                    <div className="gallery__card-meta">
                      <span className="gallery__card-date">{formatDate(card.createdAt)}</span>
                    </div>
                  </div>
                  {!isSelectMode && (
                    <div className="gallery__card-actions">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => router.push(`/edit/${card._id}`)}
                        className="gallery__card-edit"
                      >
                        <FiEdit3 />
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            ))}

            {/* 다음 페이지 로딩 인디케이터 */}
            {(isFetchingNextPage || (hasNextPage && !isLoading && filteredPhotocards.length > 0)) &&
              skeletonCards}
          </div>
        )}
      </div>
    </div>
  );
}

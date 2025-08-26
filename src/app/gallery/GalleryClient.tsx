'use client';

import React from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiTrash2, FiEdit3, FiGrid } from 'react-icons/fi';
import Button from '../_component/Button';
import PhotocardCard from '../_component/PhotocardCard';
import Skeleton from '../_component/Skeleton';
import { useModal } from '../_context/ModalContext';
import UploadModal from '../_component/UploadModal';
import customFetch from '../_hook/customFetch';
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
  const queryClient = useQueryClient();
  const { showModal } = useModal();
  const [titleSearch, setTitleSearch] = React.useState('');
  const [isSelectMode, setIsSelectMode] = React.useState(false);
  const [deletingCardId, setDeletingCardId] = React.useState<string | null>(null);
  const [cardToDelete, setCardToDelete] = React.useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState<Photocard | null>(null);

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
        const totalCount = response.data.pagination.totalCount;

        // 이미지 URL들을 추출하여 미리 로드
        const imageUrls = photocards.map((card: Photocard) => card.images.main);
        await preloadImages(imageUrls);

        return {
          data: photocards,
          nextPage: hasNextPage ? response.data.pagination.nextCursor : undefined,
          totalCount,
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

  // 전체 포토카드 개수 (첫 번째 페이지의 totalCount 사용)
  const totalCount = React.useMemo(() => {
    return data?.pages[0]?.totalCount || 0;
  }, [data]);

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
      // 현재 로드된 포토카드 수가 10의 배수보다 적으면 다음 페이지가 있을 가능성이 높음
      const currentTotalCards = photocards.length;

      // 마지막 페이지가 가득 차있지 않으면 다음 페이지가 없을 가능성이 높지만,
      // 서버에서 정확한 정보를 받아야 하므로 일단 시도
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, photocards.length]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 포토카드 편집 함수
  const handleEditCard = (card: Photocard) => {
    setEditingCard(card);
    setEditModalOpen(true);
  };

  // 포토카드 삭제 함수
  const handleDeleteCard = async (cardId: string) => {
    setCardToDelete(cardId);

    const confirmed = await showModal({
      type: 'confirm',
      title: '포토카드 삭제',
      message: '정말로 이 포토카드를 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (confirmed) {
      confirmDelete();
    }
  };

  // 편집 완료 핸들러
  const handleEditComplete = (updatedCard: Photocard) => {
    // 캐시에서 해당 포토카드 업데이트
    queryClient.setQueriesData(
      { queryKey: titleSearch ? ['photocards', titleSearch] : ['photocards'] },
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((card: Photocard) =>
              card._id === updatedCard._id ? updatedCard : card,
            ),
          })),
        };
      },
    );

    // 편집 모달 닫기
    setEditModalOpen(false);
    setEditingCard(null);

    // 성공 메시지
    showModal({
      type: 'success',
      title: '수정 완료',
      message: '포토카드가 성공적으로 수정되었습니다.',
      confirmText: '확인',
    });
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;

    setDeletingCardId(cardToDelete);

    try {
      await customFetch.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/${cardToDelete}`,
      );

      // 성공적으로 삭제되면 캐시에서 해당 포토카드만 제거하고 totalCount 감소
      queryClient.setQueriesData(
        { queryKey: titleSearch ? ['photocards', titleSearch] : ['photocards'] },
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any, index: number) => ({
              ...page,
              data: page.data.filter((card: Photocard) => card._id !== cardToDelete),
              // 첫 번째 페이지의 totalCount만 감소
              totalCount: index === 0 ? (page.totalCount || 0) - 1 : page.totalCount,
            })),
          };
        },
      );

      // 삭제 성공 메시지
      showModal({
        type: 'success',
        title: '삭제 완료',
        message: '포토카드가 성공적으로 삭제되었습니다.',
        confirmText: '확인',
      });
    } catch (error) {
      console.error('포토카드 삭제 중 오류:', error);
      showModal({
        type: 'error',
        title: '삭제 실패',
        message: '포토카드 삭제에 실패했습니다.',
        confirmText: '확인',
      });
    } finally {
      setDeletingCardId(null);
      setCardToDelete(null);
    }
  };

  // 현재 화면 크기에 따른 그리드 열 수 계산
  const [gridColumns, setGridColumns] = React.useState(3);

  React.useEffect(() => {
    const calculateGridColumns = () => {
      const width = window.innerWidth;

      // 모바일에서는 1열, 그 외에는 CSS 계산
      if (width <= 768) {
        setGridColumns(1);
      } else {
        const containerWidth = Math.min(width - 64, 1200); // 패딩과 최대 너비 고려
        const cardWidth = 280; // CSS의 minmax(280px, 1fr) 기준
        const gap = 24; // CSS의 gap 값

        // 실제 그리드 열 수 계산
        const columns = Math.floor((containerWidth + gap) / (cardWidth + gap));
        setGridColumns(Math.max(1, columns));
      }
    };

    calculateGridColumns();
    window.addEventListener('resize', calculateGridColumns);
    return () => window.removeEventListener('resize', calculateGridColumns);
  }, []);

  // 스켈레톤 카드 개수 계산
  const calculateSkeletonCount = (currentCardCount: number, columns: number) => {
    if (currentCardCount === 0) {
      // 카드가 없을 때는 기본 6개 또는 그리드 열 수의 2배
      return Math.min(6, columns * 2);
    }

    // 현재 카드들이 마지막 줄에서 몇 개를 차지하는지 계산
    const cardsInLastRow = currentCardCount % columns;

    // 마지막 줄이 완전히 채워졌으면 다음 줄 전체를 스켈레톤으로
    // 마지막 줄이 비어있으면 나머지 공간 + 다음 한 줄 전체를 스켈레톤으로
    const skeletonCount = cardsInLastRow === 0 ? columns : columns - cardsInLastRow + columns;

    return skeletonCount;
  };

  // 스켈레톤 카드들 생성
  const skeletonCount = calculateSkeletonCount(filteredPhotocards.length, gridColumns);
  const skeletonCards = Array.from({ length: skeletonCount }).map((_, index) => (
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
            <p className="gallery__subtitle">{totalCount}개의 포토카드가 있습니다</p>
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
              <div
                key={card._id}
                className={`gallery__card-wrapper ${deletingCardId === card._id ? 'deleting' : ''}`}
              >
                <PhotocardCard
                  card={card}
                  variant="gallery"
                  showActions={true}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  isDeleting={deletingCardId === card._id}
                />
              </div>
            ))}

            {/* 다음 페이지 로딩 인디케이터 */}
            {(isFetchingNextPage || (hasNextPage && !isLoading && filteredPhotocards.length > 0)) &&
              skeletonCards}
          </div>
        )}
      </div>

      {/* 편집 모달 */}
      {editingCard && (
        <UploadModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingCard(null);
          }}
          uploadData={{
            imageData: editingCard.images.main,
            originalImage: editingCard.images.main,
            stickers: [],
          }}
          isEditMode={true}
          photocardId={editingCard._id}
          initialTitle={editingCard.title}
          initialContent={editingCard.description}
          onEditComplete={handleEditComplete}
        />
      )}
    </div>
  );
}

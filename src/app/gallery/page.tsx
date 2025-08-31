'use client';

import React from 'react';
import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiGrid } from 'react-icons/fi';

import Button from '@/app/_component/Button';
import PhotocardCard from '@/app/_component/PhotocardCard';
import Skeleton from '@/app/_component/Skeleton';
import UploadModal from '@/app/_component/UploadModal';
import { useModal } from '@/app/_context/ModalContext';
import customFetch from '@/app/_hook/customFetch';

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
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState<Photocard | null>(null);
  const [gridColumns, setGridColumns] = React.useState(3);

  const preloadImages = React.useCallback(async (imageUrls: string[]): Promise<void> => {
    if (imageUrls.length === 0) return;

    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = url;
      });
    });

    await Promise.allSettled(imagePromises);
  }, []);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: titleSearch ? ['photocards', titleSearch] : ['photocards'],
      queryFn: async ({ pageParam }) => {
        const params = new URLSearchParams({
          limit: '10',
        });

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
    });

  const photocards = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = React.useMemo(() => {
    return data?.pages[0]?.totalCount || 0;
  }, [data]);

  const handleScroll = React.useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const cardElements = document.querySelectorAll(
      '.gallery__card-wrapper:not(.gallery__skeleton)',
    );
    if (cardElements.length === 0) return;

    const lastCard = cardElements[cardElements.length - 1];
    const lastCardRect = lastCard.getBoundingClientRect();
    const lastCardBottom = lastCardRect.bottom;

    if (lastCardBottom <= window.innerHeight + 100) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const deleteMutation = useMutation({
    mutationFn: async (cardId: string) => {
      return await customFetch.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/${cardId}`,
      );
    },
    onSuccess: () => {
      showModal({
        type: 'success',
        title: '삭제 완료',
        message: '포토카드가 성공적으로 삭제되었습니다.',
        confirmText: '확인',
      });
    },
    onError: () => {
      showModal({
        type: 'error',
        title: '삭제 실패',
        message: '포토카드 삭제에 실패했습니다.',
        confirmText: '확인',
      });
    },
  });

  const handleEditCard = (card: Photocard) => {
    setEditingCard(card);
    setEditModalOpen(true);
  };

  const handleDeleteCard = async (cardId: string) => {
    const confirmed = await showModal({
      type: 'confirm',
      title: '포토카드 삭제',
      message: '정말로 이 포토카드를 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (confirmed) {
      deleteMutation.mutate(cardId, {
        onSuccess: () => {
          queryClient.setQueriesData(
            { queryKey: titleSearch ? ['photocards', titleSearch] : ['photocards'] },
            (oldData: any) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page: any, index: number) => ({
                  ...page,
                  data: page.data.filter((card: Photocard) => card._id !== cardId),
                  totalCount: index === 0 ? (page.totalCount || 0) - 1 : page.totalCount,
                })),
              };
            },
          );
        },
      });
    }
  };

  const handleEditComplete = (updatedCard: Photocard) => {
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

    setEditModalOpen(false);
    setEditingCard(null);
  };

  React.useEffect(() => {
    const calculateGridColumns = () => {
      const cardWidth = 280;
      const gap = 24;
      const containerWidth = Math.min(window.innerWidth - 64, 1200);
      const columns = Math.max(1, Math.floor((containerWidth + gap) / (cardWidth + gap)));
      setGridColumns(columns);
    };

    calculateGridColumns();
    window.addEventListener('resize', calculateGridColumns);
    return () => window.removeEventListener('resize', calculateGridColumns);
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const calculateSkeletonCount = (currentCardCount: number, columns: number) => {
    if (currentCardCount === 0) {
      return Math.min(6, columns * 2);
    }

    const cardsInLastRow = currentCardCount % columns;
    const skeletonCount = cardsInLastRow === 0 ? columns : columns - cardsInLastRow + columns;
    return skeletonCount;
  };

  const skeletonCount = calculateSkeletonCount(photocards.length, gridColumns);
  const skeletonCards = Array.from({ length: skeletonCount }).map((_, index) => (
    <div key={`skeleton-${index}`} className="gallery__card-wrapper gallery__skeleton">
      <Skeleton className="gallery__card" />
    </div>
  ));

  return (
    <div className="gallery">
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

      <div className="gallery__toolbar">
        <div className="gallery__toolbar-left">
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
        ) : photocards.length === 0 ? (
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
            {photocards.map((card: Photocard) => (
              <div
                key={card._id}
                className={`gallery__card-wrapper ${
                  deleteMutation.isPending && deleteMutation.variables === card._id
                    ? 'deleting'
                    : ''
                }`}
              >
                <PhotocardCard
                  card={card}
                  variant="gallery"
                  showActions={true}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === card._id}
                />
              </div>
            ))}

            {(isFetchingNextPage || (hasNextPage && !isLoading && photocards.length > 0)) &&
              skeletonCards}
          </div>
        )}
      </div>

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

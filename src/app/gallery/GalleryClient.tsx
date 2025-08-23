'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiFilter, FiTrash2, FiEdit3, FiGrid } from 'react-icons/fi';
import Button from '../_component/Button';
import Card from '../_component/Card';
import Loading from '../_component/Loading';
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

export default function GalleryClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCards, setSelectedCards] = React.useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = React.useState(false);

  // 인증 확인
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 포토카드 목록 조회 (서버에서 prefetch된 데이터 사용)
  const {
    data: photocards,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['photocards', searchTerm], // 검색어가 변경될 때마다 새로운 쿼리
    queryFn: async () => {
      if (!session?.user?.email) {
        return dummyPhotocards;
      }

      // 실제 API 호출 (검색어 포함)
      const params = new URLSearchParams({
        limit: '10',
        skip: '0',
      });

      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }

      const response = await customFetch.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/album?${params}`,
      );
      return response.data.productInfo;

      // 더미 데이터 반환 (개발용, 실제 API 사용 시 주석 처리)
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // return dummyPhotocards;
    },
    enabled: status === 'authenticated',
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // 백엔드에서 검색된 포토카드 사용 (클라이언트 필터링 제거)
  const filteredPhotocards = photocards || [];

  // 선택 모드 토글
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedCards([]);
  };

  // 카드 선택/해제
  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    );
  };

  // 선택된 카드 삭제 (더미 데이터용)
  const deleteSelectedCards = async () => {
    if (selectedCards.length === 0) return;

    try {
      // 실제 API 호출 대신 더미 삭제 로직
      // await customFetch.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/delete`, {
      //   body: { ids: selectedCards },
      // });

      // 더미 데이터에서 선택된 카드들 제거
      const updatedPhotocards = dummyPhotocards.filter((card) => !selectedCards.includes(card._id));
      // 실제로는 상태를 업데이트해야 하지만, 더미 데이터이므로 refetch로 처리

      setSelectedCards([]);
      setIsSelectMode(false);
      refetch();
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gallery__search-input"
            />
          </div>
        </div>
      </div>

      {/* 선택된 카드 액션 */}
      {isSelectMode && selectedCards.length > 0 && (
        <div className="gallery__selection-actions">
          <div className="gallery__selection-info">{selectedCards.length}개 선택됨</div>
          <div className="gallery__selection-buttons">
            <Button variant="secondary" size="small" onClick={() => setSelectedCards([])}>
              선택 해제
            </Button>
            <Button variant="danger" size="small" onClick={deleteSelectedCards}>
              <FiTrash2 />
              삭제
            </Button>
          </div>
        </div>
      )}

      {/* 포토카드 그리드 */}
      <div className="gallery__content">
        {error ? (
          <div className="gallery__error">
            <p>포토카드를 불러오는 중 오류가 발생했습니다.</p>
            <Button variant="secondary" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        ) : filteredPhotocards.length === 0 ? (
          <div className="gallery__empty">
            <div className="gallery__empty-icon">
              <FiGrid />
            </div>
            <h3 className="gallery__empty-title">
              {searchTerm ? '검색 결과가 없습니다' : '아직 포토카드가 없습니다'}
            </h3>
            <p className="gallery__empty-subtitle">
              {searchTerm ? '다른 검색어를 시도해보세요' : '첫 번째 포토카드를 만들어보세요'}
            </p>
            {!searchTerm && (
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
                className={`gallery__card-wrapper ${
                  selectedCards.includes(card._id) ? 'gallery__card-wrapper--selected' : ''
                }`}
              >
                {isSelectMode && (
                  <div className="gallery__card-selector">
                    <input
                      type="checkbox"
                      checked={selectedCards.includes(card._id)}
                      onChange={() => toggleCardSelection(card._id)}
                      className="gallery__card-checkbox"
                    />
                  </div>
                )}
                <Card className="gallery__card">
                  <div className="gallery__card-image">
                    <img src={card.images.main} alt={card.title} />
                  </div>
                  <div className="gallery__card-content">
                    <h3 className="gallery__card-title">{card.title}</h3>
                    <p className="gallery__card-text">{card.description}</p>
                    <div className="gallery__card-meta">
                      <span className="gallery__card-date">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </span>
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
          </div>
        )}
      </div>
    </div>
  );
}

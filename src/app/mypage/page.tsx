'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FiUser, FiMail, FiLock, FiGrid, FiArrowRight } from 'react-icons/fi';
import Button from '../_component/Button';
import Card from '../_component/Card';
import customFetch from '../_hook/customFetch';
import '../style/page/mypage.scss';

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

export default function MyPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // 사용자의 포토카드 목록 조회
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ['my-photocards'],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: '10',
      });

      if (pageParam) {
        params.append('last_id', pageParam as string);
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
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const photocards = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="mypage">
      <div className="mypage__container">
        {/* 회원 정보 섹션 */}
        <section className="mypage__profile">
          <div className="mypage__profile-card">
            <div className="mypage__profile-avatar">
              <div className="mypage__avatar-placeholder">
                <FiUser />
              </div>
            </div>
            <div className="mypage__profile-info">
              <h2 className="mypage__profile-name">{session?.user?.name || '사용자'}</h2>
              <div className="mypage__profile-email">
                <FiMail />
                <span>{session?.user?.email}</span>
              </div>
            </div>
            <div className="mypage__profile-actions">
              <Button
                variant="secondary"
                onClick={() => router.push('/forgot-password')}
                icon={<FiLock />}
              >
                비밀번호 재설정
              </Button>
            </div>
          </div>
        </section>

        {/* 포토카드 섹션 */}
        <section className="mypage__photocards">
          <div className="mypage__section-header">
            <h3 className="mypage__section-title">내 포토카드</h3>
            <Button
              className="mypage__section-button"
              variant="primary"
              onClick={() => router.push('/gallery')}
              icon={<FiGrid />}
            >
              갤러리 보기
            </Button>
          </div>

          {isLoading ? (
            <div className="mypage__loading">
              <div className="loading-spinner" />
              <p>포토카드를 불러오는 중...</p>
            </div>
          ) : photocards.length === 0 ? (
            <div className="mypage__empty">
              <div className="mypage__empty-icon">
                <FiGrid />
              </div>
              <h4>아직 포토카드가 없습니다</h4>
              <p>첫 번째 포토카드를 만들어보세요</p>
              <Button
                variant="primary"
                onClick={() => router.push('/create')}
                icon={<FiArrowRight />}
              >
                포토카드 만들기
              </Button>
            </div>
          ) : (
            <div className="mypage__photocards-slider">
              <div className="mypage__photocards-grid">
                {photocards.slice(0, 6).map((card: Photocard) => (
                  <div key={card._id} className="mypage__photocard-item">
                    <Card className="mypage__photocard-card">
                      <div className="mypage__photocard-image">
                        <img src={card.images.main} alt={card.title} />
                      </div>
                      <div className="mypage__photocard-content">
                        <h4 className="mypage__photocard-title">{card.title}</h4>
                        <p className="mypage__photocard-description">{card.description}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              {photocards.length > 6 && (
                <div className="mypage__photocards-more">
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/gallery')}
                    icon={<FiArrowRight />}
                  >
                    더 보기 ({photocards.length - 6}개 더)
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

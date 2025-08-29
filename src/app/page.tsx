'use client';

import Link from 'next/link';
import Button from './_component/Button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import './style/home.scss';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-text">새로운 기능</span>
              <span className="hero__badge-feature">갤러리 기능 추가</span>
            </div>

            <h1 className="hero__title">
              소중한 순간을 담아내는
              <br />
              <span className="hero__title-highlight">나만의 포토카드</span>를 만들어보세요
            </h1>

            <p className="hero__subtitle">
              소중한 순간들을 아름다운 포토카드로 만들어보세요. 스마트한 편집 도구와 다양한 스티커로
              누구나 쉽게 다양한 포토카드를 제작할 수 있습니다.
            </p>

            <div className="hero__actions">
              <Button
                variant="primary"
                size="large"
                onClick={() => router.push('/create')}
                className="hero__cta"
              >
                포토카드 만들기
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={() => router.push('/gallery')}
                className="hero__demo"
              >
                내 갤러리
              </Button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-number">10K+</div>
                <div className="hero__stat-label">제작된 포토카드</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">99%</div>
                <div className="hero__stat-label">만족도</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">5분</div>
                <div className="hero__stat-label">평균 제작 시간</div>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__cards">
              <div className="photocard photocard--1">
                <div className="photocard__image"></div>
                <div className="photocard__stickers">
                  <div className="sticker sticker--heart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div className="sticker sticker--star">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="photocard photocard--2">
                <div className="photocard__image"></div>
                <div className="photocard__stickers">
                  <div className="sticker sticker--sparkle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div className="sticker sticker--circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="photocard photocard--3">
                <div className="photocard__image"></div>
                <div className="photocard__stickers">
                  <div className="sticker sticker--plus">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features__container">
          <div className="features__header">
            <h2 className="features__title">누구나 쉽게 만들 수 있는 포토카드</h2>
            <p className="features__subtitle">
              PhotoCard는 누구나 쉽고 재미있게 사용할 수 있도록 설계되었습니다. 반려동물의 일상부터
              소중한 순간까지, 특별한 기록을 아름다운 포토카드로 남겨보세요.
            </p>
          </div>

          <div className="features__grid">
            <div className="feature">
              <div className="feature__icon">
                <div className="feature__icon-bg feature__icon-bg--design"></div>
                <svg
                  className="feature__icon-svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="feature__title">직관적인 디자인</h3>
              <p className="feature__description">
                드래그 앤 드롭으로 쉽게 스티커를 배치하고, 실시간으로 결과를 확인할 수 있습니다.
              </p>
            </div>

            <div className="feature">
              <div className="feature__icon">
                <div className="feature__icon-bg feature__icon-bg--diary"></div>
                <svg
                  className="feature__icon-svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <h3 className="feature__title">특별한 기록</h3>
              <p className="feature__description">
                반려동물의 일상, 여행의 추억, 소중한 순간들을 아름다운 포토카드로 기록하세요.
              </p>
            </div>

            <div className="feature">
              <div className="feature__icon">
                <div className="feature__icon-bg feature__icon-bg--quality"></div>
                <svg
                  className="feature__icon-svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="feature__title">고품질 출력</h3>
              <p className="feature__description">최적화를 통해 높은 품질을 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <div className="process__container">
          <div className="process__content">
            <h2 className="process__title">간단한 3단계로 완성</h2>
            <p className="process__subtitle">
              복잡한 과정 없이 몇 분만에 전문가 수준의 포토카드를 만들어보세요.
            </p>

            <div className="process__steps">
              <div className="process__step">
                <div className="process__step-number">01</div>
                <div className="process__step-content">
                  <h3 className="process__step-title">사진 업로드</h3>
                  <p className="process__step-description">좋아하는 사진을 업로드하세요.</p>
                </div>
              </div>

              <div className="process__step">
                <div className="process__step-number">02</div>
                <div className="process__step-content">
                  <h3 className="process__step-title">스티커 꾸미기</h3>
                  <p className="process__step-description">
                    다양한 스티커로 포토카드를 개성있게 꾸며보세요.
                  </p>
                </div>
              </div>

              <div className="process__step">
                <div className="process__step-number">03</div>
                <div className="process__step-content">
                  <h3 className="process__step-title">저장 및 공유</h3>
                  <p className="process__step-description">
                    완성된 포토카드를 저장하고 SNS에 공유해보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="process__visual">
            <div className="process__preview">
              <div className="process__preview-screen">
                <div className="process__preview-header">
                  <div className="process__preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="process__preview-content">
                  <div className="process__editor">
                    <div className="process__canvas">
                      <div className="process__photo"></div>
                      <div className="process__sticker process__sticker--1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <div className="process__sticker process__sticker--2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="process__toolbar">
                      <div className="process__tool"></div>
                      <div className="process__tool"></div>
                      <div className="process__tool"></div>
                      <div className="process__tool"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta__container">
          <div className="cta__content">
            <h2 className="cta__title">지금 바로 시작해보세요</h2>
            <p className="cta__subtitle">
              무료로 시작하여 특별한 포토카드를 만들어보세요.
              {!session && '계정 생성은 30초면 충분합니다.'}
            </p>
            <div className="cta__actions">
              <Button variant="primary" size="large" onClick={() => router.push('/create')}>
                무료로 시작하기
              </Button>
              {!session && (
                <Button variant="secondary" size="large" onClick={() => router.push('/register')}>
                  계정 만들기
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

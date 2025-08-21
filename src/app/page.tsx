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
              <span className="hero__badge-feature">AI 스티커 추천</span>
            </div>

            <h1 className="hero__title">
              PhotoCard는 추억을 담는
              <br />
              <span className="hero__title-highlight">완벽한 도구</span>입니다
            </h1>

            <p className="hero__subtitle">
              소중한 순간들을 아름다운 포토카드로 만들어보세요. 스마트한 편집 도구와 다양한
              템플릿으로 누구나 쉽게 전문가 수준의 포토카드를 제작할 수 있습니다.
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
                onClick={() => router.push('/components')}
                className="hero__demo"
              >
                데모 보기
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
            <h2 className="features__title">모든 팀을 위한 완벽한 도구</h2>
            <p className="features__subtitle">
              PhotoCard는 개인부터 기업까지, 모든 규모의 팀이 사용할 수 있도록 설계되었습니다.
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
                <div className="feature__icon-bg feature__icon-bg--speed"></div>
                <svg
                  className="feature__icon-svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.6 1.53c.56-1.24.9-2.62.9-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.05.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z" />
                </svg>
              </div>
              <h3 className="feature__title">빠른 성능</h3>
              <p className="feature__description">
                최적화된 렌더링 엔진으로 지연 없이 부드럽게 편집할 수 있습니다.
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
              <p className="feature__description">
                4K 해상도까지 지원하여 인쇄용으로도 완벽한 품질을 제공합니다.
              </p>
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
                  <p className="process__step-description">
                    좋아하는 사진을 업로드하거나 카메라로 직접 촬영하세요.
                  </p>
                </div>
              </div>

              <div className="process__step">
                <div className="process__step-number">02</div>
                <div className="process__step-content">
                  <h3 className="process__step-title">스티커 꾸미기</h3>
                  <p className="process__step-description">
                    다양한 스티커와 텍스트로 포토카드를 개성있게 꾸며보세요.
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

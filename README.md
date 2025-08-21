# 포토카드 프로젝트

Linear Dark Theme 기반의 현대적인 컴포넌트 라이브러리를 포함한 Next.js 프로젝트입니다.

## 🎨 컴포넌트 라이브러리

이 프로젝트는 Linear.app의 오리지널 다크 테마를 기반으로 한 재사용 가능한 컴포넌트들을 제공합니다.

### 사용 가능한 컴포넌트

- **Button**: Primary, Secondary, Ghost, Danger 변형과 다양한 크기 지원
- **Input**: 다양한 크기와 상태(에러, 비활성화) 지원
- **Card**: Default, Elevated, Outlined 변형과 헤더/푸터 지원
- **Badge**: 다양한 색상 변형과 제거 가능한 기능
- **Avatar**: 이미지, 폴백, 상태 표시 지원

### 컴포넌트 데모 확인

컴포넌트 데모를 확인하려면 `/components` 페이지를 방문하세요:

```bash
npm run dev
```

그 후 브라우저에서 [http://localhost:3000/components](http://localhost:3000/components)로 접속하세요.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🎯 테마 시스템

이 프로젝트는 중앙화된 테마 시스템을 사용합니다:

- **색상**: Primary, Background, Text, Border, Icon 색상 팔레트 (다크 테마)
- **타이포그래피**: Inter 폰트 패밀리와 다양한 크기/무게
- **간격**: 일관된 spacing 시스템
- **그림자**: 다크 테마에 최적화된 elevation 레벨
- **애니메이션**: 부드러운 전환 효과
- **그라디언트**: 다크 테마 전용 그라디언트 효과

테마 설정은 `src/theme/index.ts`에서 관리됩니다.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── _component/     # 재사용 가능한 컴포넌트들
│   ├── components/     # 컴포넌트 데모 페이지
│   └── style/         # SCSS 스타일 파일들
├── theme/             # 테마 설정
└── ...
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

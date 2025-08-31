# PhotoCard

<br />

<img width="2646" height="1580" alt="photocard-new vercel app_login (2)" src="https://github.com/user-attachments/assets/2124d4f3-4c6a-4cfb-93c5-55245aae161d" />

<br />
<br />

포토카드 꾸미기 사이트입니다.

🌐 **Live Demo**: [https://photocard-new.vercel.app/](https://photocard-new.vercel.app/)

Next.js, TypeScript, MongoDB, Node.js를 사용하여 만들었습니다.

react-moveable를 사용해 사용자가 직접 스티커를 화면상에서 조절하여 카드를 꾸밀수 있게 만들었습니다.
그리고 NextAuth를 사용한 로그인 기능을 구현해 그 꾸민 카드를 사용자가 자신만의 앨범에 저장하여, 갤러리에서 공유할 수 있는 기능을 만들었습니다.
관리자가 사용할 수 있는 스티커를 편리하게 추가할 수 있도록 cloudinary 저장소를 사용해 불러오고 저장할 수 있도록 만들었습니다.
로고와 메인화면에 사용한 몇몇 이미지들을 제외하면, 이 사이트의 이미지들은 전부 cloudinary 저장소를 사용해 저장하고 불러오도록 되어있습니다.

<br />
<br />

# Features

### 1. 포토카드 만들기 기능

<br />

<img width="2736" height="1688" alt="photocard-new vercel app_ (6)" src="https://github.com/user-attachments/assets/717b887d-e17b-4ab8-95f8-3b171feedbd8" />

<br />

시연영상 :
https://github.com/user-attachments/assets/32774e4d-92fa-491b-ab9e-332fe7a107d8

<br />
<br />

왼쪽의 포토카드를 꾸밀수 있는 공간과 오른쪽의 포토카드를 꾸밀 수 있는 스티커를 선택할 수 있는 공간으로 나누어져 있습니다.

react-dropzone을 사용하여 업로드 아이콘을 클릭하면 포토카드 모양의 틀에 원하는 사진을 삽입할 수 있습니다. 삽입되어진 사진의 크기가 위치가 맘에 들지 않는 경우, 다시 한번 클릭하여 사진의
사이즈를 조정하거나 위치를 조정할 수 있습니다.

그 후에 오른쪽의 상자에서 원하는 스티커를 클릭하면 클릭한 모양의 스티커가 똑같이 쪽의 포토카드의 오른쪽 상단에 나타납니다.
왼쪽에 나타난 스티커를 클릭하면 스티커를 원하는대로 수정할 수 있는 moveable박스가 생성됩니다. 클릭한 스티커만 moveable박스가 나타나도록 코딩했습니다.
사용자는 moveable박스를 이용해 해당 스티커의 사이즈를 수정하거나 원하는 위치에 이동시키거나 rotate시킬 수 있습니다.
모바일 환경에서는 두손가락으로 스티커의 사이즈를 수정하거나 rotate시킬수 있도록 했습니다.

또한 텍스트 추가 기능을 통해 포토카드에 다양한 텍스트를 삽입할 수 있습니다. 텍스트 버튼을 클릭하면 텍스트 입력 모달이 열리고,
사용자는 원하는 텍스트를 입력하고 색상, 폰트 크기(12px~72px), 폰트 굵기(보통/굵게), 텍스트 정렬(왼쪽/가운데/오른쪽),
줄 간격(0.8~3.0) 등을 자유롭게 설정할 수 있습니다. 텍스트는 줄바꿈이 가능하며, 실시간 미리보기를 통해 설정한 스타일을
미리 확인할 수 있습니다. 추가된 텍스트도 스티커와 마찬가지로 moveable박스를 통해 크기 조정, 위치 이동, 회전이 가능합니다.

포토카드 꾸미기가 완료되었다면, 오른쪽 상자아래의 완성버튼을 눌러주세요. 해당 포토카드를 편집한 날짜와 함께, 꾸민 포토카드는 갤러리에 저장됩니다. Canvas API를 이용하여
다 꾸민 카드의 이미지를 png로 cloudinary에 저장하고, 그 저장한 이미지의 주소를 다시 mongodb의 데이터베이스에 저장하는 방식으로 기능을 구현했습니다.

<br />

> Using Skills : react-moveable, react-dropzone, Canvas API, cloudinary, React Hook Form

<br />
<br />

### 2. 로그인 회원가입 기능

<br />

<img width="2646" height="1580" alt="photocard-new vercel app_login (3)" src="https://github.com/user-attachments/assets/1be0bf9a-5b84-4146-8793-2b01501b7544" />

<br />
<br />

사용자는 회원가입을 통해 유저정보를 생성할 수 있고 로그인을 통해 갤러리 페이지에 들어갈 수 있습니다. 저장했던 포토카드를 불러올수 있고 그것을 갤러리에서 확인할 수 있습니다.
NextAuth를 이용해 인증 시스템을 만들었습니다. 테스트 로그인 버튼을 통해 일시적으로 서비스를 이용할수 있습니다.

<br />
<br />

> Using Skills : NextAuth, MongoDB, Mongoose, Node.js

<br />
<br />

### 3. 비밀번호 찾기 및 재설정 기능

사용자가 비밀번호를 잊어버렸을 때 이메일을 통해 비밀번호 재설정 링크를 받을 수 있습니다.
비밀번호 찾기 페이지에서 이메일을 입력하면 인증 이메일이 전송되고, 이메일의 링크를 통해 새로운 비밀번호를 설정할 수 있습니다.
보안을 위해 토큰 기반 인증 시스템을 구현했습니다.

<br />

> Using Skills : Email Service, Token-based Authentication, React Hook Form

<br />
<br />

### 4. 갤러리 기능

<br />

<img width="2736" height="1688" alt="photocard-new vercel app_ (4)" src="https://github.com/user-attachments/assets/1544a399-e68d-46dd-aa5c-5c349bdcc041" />

<br />
<br />

만들고 저장했던 포토카드를 불러올수 있습니다. 무한 스크롤을 통해 더 많은 포토카드를 로드할 수 있습니다. 갤러리에서 사용자는 만들었던 포토카드를 확인할 수 있습니다. 포토카드 제목을 기준으로 실시간 검색이 가능하며, 화면 크기에 따라 자동으로 카드 배치가 조정되는 반응형 그리드 레이아웃을 제공합니다. 각 포토카드에 대해 편집, 삭제, 다운로드 기능을 제공하여 사용자가 포토카드를 관리할 수 있습니다. 기존 포토카드의 제목과 설명을 수정할 수 있고, 확인 모달과 함께 안전한 삭제 기능을 제공하며, 포토카드를 PNG 파일로 다운로드할 수 있습니다.

<br />

> Using Skills : TanStack Query, Infinite Scroll, React Hook Form, Modal System

<br />
<br />

### 5. 마이페이지 기능

<br />

<img width="2736" height="1688" alt="photocard-new vercel app_ (5)" src="https://github.com/user-attachments/assets/4babe208-ea62-47c4-98f0-8b9e909e09fc" />

<br />
<br />

사용자의 프로필 정보를 확인하고 관리할 수 있습니다. 로그인한 사용자의 정보를 표시하고, 필요에 따라 비밀번호를 재설정할수 있습니다.

<br />

> Using Skills : NextAuth, MongoDB

<br />
<br />

# Skills

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary
- Nodemailer

## Frontend

- Next.js 14
- TypeScript
- React
- TanStack Query
- NextAuth
- react-moveable
- react-dropzone
- react-icons
- SCSS

## Development Tools

- ESLint
- Prettier
- Git

<br />
<br />

# Project Structure

```
photocard_new/
├── src/
│   ├── app/
│   │   ├── _component/          # 공통 컴포넌트
│   │   ├── _context/           # Context API
│   │   ├── _hook/              # 커스텀 훅
│   │   ├── api/                # API 라우트
│   │   ├── create/             # 포토카드 생성 페이지
│   │   ├── forgot-password/    # 비밀번호 찾기 페이지
│   │   ├── gallery/            # 갤러리 페이지
│   │   ├── login/              # 로그인 페이지
│   │   ├── mypage/             # 마이페이지
│   │   ├── register/           # 회원가입 페이지
│   │   ├── reset-password/     # 비밀번호 재설정 페이지
│   │   ├── set-total-user/     # 전체 사용자 설정 페이지
│   │   └── style/              # 스타일 파일
│   ├── auth.ts                 # NextAuth 설정
│   └── middleware.ts           # 미들웨어
├── public/                     # 정적 파일
└── package.json
```

<br />
<br />

# License

This project is licensed under the MIT License.

<br />
<br />

# Deployment

이 프로젝트는 GitHub에서 Vercel을 통해 배포되었습니다.

- **배포 플랫폼**: Vercel
- **배포 방식**: GitHub 연동 자동 배포
- **도메인**: Vercel 제공 도메인 사용

<br />
<br />

# Contact

Project Link: [https://github.com/Choseoungyeon/photocard_new](https://github.com/Choseoungyeon/photocard_new)

<br />
<br />

---

**Contribution**: 100%

**Progress**: 95%

**Last Updated**: 2025.01.27

**Planned Features**:

- 포토카드 템플릿 기능

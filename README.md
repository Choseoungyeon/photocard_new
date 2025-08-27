# PhotoCard

<br />
<br />

<img width="2646" height="1580" alt="image" src="https://github.com/user-attachments/assets/b51ac649-5b0a-40c1-aefc-6d558714963c" />

<br />
<br />

포토카드 꾸미기 사이트입니다.

Next.js, TypeScript, MongoDB, Node.js를 사용하여 만들었습니다.

react-moveable를 사용해 사용자가 직접 스티커를 화면상에서 조절하여 카드를 꾸밀수 있게 만들었습니다.
그리고 NextAuth를 사용한 로그인 기능을 구현해 그 꾸민 카드를 사용자가 자신만의 앨범에 저장하여, 갤러리에서 공유할 수 있는 기능을 만들었습니다.
관리자가 사용할 수 있는 스티커를 편리하게 추가할 수 있도록 cloudinary 저장소를 사용해 불러오고 저장할 수 있도록 만들었습니다.
로고와 메인화면에 사용한 몇몇 이미지들을 제외하면, 이 사이트의 이미지들은 전부 cloudinary 저장소를 사용해 저장하고 불러오도록 되어있습니다.

<br />
<br />

# Features

### 1. 로그인 회원가입 기능

<br />
<br />

<img width="2646" height="1580" alt="image" src="https://github.com/user-attachments/assets/14b26007-0b38-4218-b872-7a00810b228f" />

<br />

사용자는 회원가입을 통해 유저정보를 생성할 수 있고 로그인을 통해 갤러리 페이지에 들어갈 수 있습니다. 저장했던 포토카드를 불러올수 있고 그것을 갤러리에서 확인할 수 있습니다.
NextAuth를 이용해 인증 시스템을 만들었습니다.

<br />

> Using Skills : NextAuth, MongoDB, Mongoose, Node.js

<br />
<br />

### 2. 갤러리 기능

만들고 저장했던 포토카드를 불러올수 있습니다. 무한 스크롤을 통해 더 많은 포토카드를 로드할 수 있습니다. 갤러리에서 사용자는 만들었던 포토카드를 확인할 수 있습니다.

<br />

> Using Skills : TanStack Query, Infinite Scroll

<br />
<br />

### 3. 포토카드 만들기 기능

<br />
<br />

<img width="2646" height="1580" alt="image" src="https://github.com/user-attachments/assets/48447f25-183d-44cf-8278-6962a233024e" />

<br />

왼쪽의 포토카드를 꾸밀수 있는 공간과 오른쪽의 포토카드를 꾸밀 수 있는 스티커를 선택할 수 있는 공간으로 나누어져 있습니다.

react-dropzone을 사용하여 +모양을 클릭하면 포토카드 모양의 틀에 원하는 사진을 삽입할 수 있습니다. 삽입되어진 사진의 크기가 위치가 맘에 들지 않는 경우, 다시 한번 클릭하여 사진의
사이즈를 조정하거나 위치를 조정할 수 있습니다.

그 후에 오른쪽의 상자에서 원하는 스티커를 클릭하면 클릭한 모양의 스티커가 똑같이 쪽의 포토카드의 오른쪽 상단에 나타납니다.
왼쪽에 나타난 스티커를 클릭하면 스티커를 원하는대로 수정할 수 있는 moveable박스가 생성됩니다. 클릭한 스티커만 moveable박스가 나타나도록 코딩했습니다.
사용자는 moveable박스를 이용해 해당 스티커의 사이즈를 수정하거나 원하는 위치에 이동시키거나 rotate시킬 수 있습니다.
모바일 환경에서는 두손가락으로 스티커의 사이즈를 수정하거나 rotate시킬수 있도록 했습니다.

포토카드 꾸미기가 완료되었다면, 오른쪽 상자아래의 완성버튼을 눌러주세요. 해당 포토카드를 편집한 날짜와 함께, 꾸민 포토카드는 갤러리에 저장됩니다. Canvas API를 이용하여
다 꾸민 카드의 이미지를 png로 cloudinary에 저장하고, 그 저장한 이미지의 주소를 다시 mongodb의 데이터베이스에 저장하는 방식으로 기능을 구현했습니다.

<br />

> Using Skills : react-moveable, react-dropzone, Canvas API, cloudinary

<br />
<br />

### 4. 마이페이지 기능

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
│   │   ├── gallery/            # 갤러리 페이지
│   │   ├── login/              # 로그인 페이지
│   │   ├── mypage/             # 마이페이지
│   │   ├── register/           # 회원가입 페이지
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

# Contact

Project Link: [https://github.com/Choseoungyeon/photocard_new](https://github.com/Choseoungyeon/photocard_new)

<br />
<br />

---

**Contribution**: 100%

**Progress**: 90%

**Last Updated**: 2025.08.27

**Planned Features**:

- 포토카드 템플릿 기능

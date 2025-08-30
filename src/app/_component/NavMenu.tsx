'use client';

import '@/app/style/ui/nav-menu.scss';
import {
  FiX,
  FiHome,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiGrid,
  FiImage,
  FiUserCheck,
  FiMenu,
} from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Button from './Button';

type MenuItem = {
  icon?: React.ReactNode;
  label?: string;
  route?: string;
  action?: () => void;
  divider?: boolean;
};

export default function NavMenu() {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = (route: string) => {
    router.push(route);
    setVisibleMenu(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setVisibleMenu(false);
  };

  const menuItems: MenuItem[] = [
    { icon: <FiHome />, label: '홈', route: '/' },
    { icon: <FiImage />, label: '포토카드 만들기', route: '/create' },
  ];

  if (!session) {
    menuItems.push(
      { divider: true },
      { icon: <FiLogIn />, label: '로그인', route: '/login' },
      { icon: <FiUser />, label: '회원가입', route: '/register' },
    );
  } else {
    menuItems.push(
      { icon: <FiGrid />, label: '갤러리', route: '/gallery' },
      { divider: true },
      { icon: <FiUserCheck />, label: '마이페이지', route: '/mypage' },
      { divider: true },
      { icon: <FiLogOut />, label: '로그아웃', route: '', action: handleLogout },
    );
  }

  return (
    <nav className={`navWrap ${visibleMenu ? 'is-active' : ''}`}>
      <div className="wrap">
        <div className="logo" onClick={() => handleClick('/')}>
          <Image
            src="/logo_simple_black.svg"
            alt="PhotoCard Logo"
            width={20}
            height={20}
            className="logoImage"
          />
          <span className="logoText">PhotoCard</span>
        </div>

        <div className="navActions">
          {session && (
            <div className="userSection">
              <button className="userButton" onClick={() => handleClick('/mypage')}>
                <div className="userAvatarFallback">
                  <FiUser size={16} />
                </div>
              </button>
            </div>
          )}

          <button
            className="menuButton"
            onClick={() => setVisibleMenu(!visibleMenu)}
            aria-label="메뉴 열기"
          >
            {visibleMenu ? <FiX className="icon" /> : <FiMenu className="icon" />}
          </button>
        </div>
      </div>

      {visibleMenu && (
        <div className="overlay" onClick={() => setVisibleMenu(false)} style={{ zIndex: 100000 }}>
          <div className="menuContainer" onClick={(e) => e.stopPropagation()}>
            <button
              className="closeButton"
              onClick={() => setVisibleMenu(false)}
              aria-label="메뉴 닫기"
            >
              <FiX className="closeIcon" />
            </button>
            {session ? (
              <div className="userInfo">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className="userInfoAvatar"
                  />
                ) : (
                  <div className="userInfoAvatarFallback">
                    <FiUser size={20} />
                  </div>
                )}
                <div className="userInfoText">
                  <div className="userName">{session.user?.name || '사용자'}</div>
                  <div className="userEmail">{session.user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="loginPrompt">
                <div className="loginPromptIcon">
                  <FiUser size={24} />
                </div>
                <div className="loginPromptText">
                  <div className="loginPromptTitle">로그인하여 시작하세요</div>
                  <div className="loginPromptSubtitle">
                    포토카드를 만들고 저장하려면 계정이 필요합니다
                  </div>
                </div>
                <div className="loginPromptActions">
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => handleClick('/login')}
                    className="loginPromptButton"
                  >
                    로그인
                  </Button>
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => handleClick('/register')}
                    className="loginPromptButtonSecondary"
                  >
                    회원가입
                  </Button>
                </div>
              </div>
            )}

            <ul className="menuWrap">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.divider ? (
                    <div className="menuDivider" />
                  ) : (
                    <button
                      className="menuItem"
                      onClick={() =>
                        item.action ? item.action() : item.route ? handleClick(item.route) : null
                      }
                    >
                      <span className="menuIcon">{item.icon}</span>
                      <span className="menuLabel">{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

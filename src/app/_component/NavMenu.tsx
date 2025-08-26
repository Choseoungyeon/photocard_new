'use client';

import style from './NavMenu.module.css';
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

  // 로그인하지 않은 경우에만 로그인/회원가입 메뉴 추가
  if (!session) {
    menuItems.push(
      { divider: true },
      { icon: <FiLogIn />, label: '로그인', route: '/login' },
      { icon: <FiUser />, label: '회원가입', route: '/register' },
    );
  } else {
    // 로그인된 경우 갤러리 메뉴와 사용자 메뉴 추가
    menuItems.push(
      { icon: <FiGrid />, label: '갤러리', route: '/gallery' },
      { divider: true },
      { icon: <FiUserCheck />, label: '마이페이지', route: '/mypage' },
      { divider: true },
      { icon: <FiLogOut />, label: '로그아웃', route: '', action: handleLogout },
    );
  }

  return (
    <nav className={style.navWrap}>
      <div className={style.wrap}>
        <div className={style.logo} onClick={() => handleClick('/')}>
          <Image
            src="/logo_simple_black.svg"
            alt="PhotoCard Logo"
            width={20}
            height={20}
            className={style.logoImage}
          />
          <span className={style.logoText}>PhotoCard</span>
        </div>

        <div className={style.navActions}>
          {session && (
            <div className={style.userSection}>
              <button className={style.userButton} onClick={() => handleClick('/mypage')}>
                <div className={style.userAvatarFallback}>
                  <FiUser size={16} />
                </div>
              </button>
            </div>
          )}

          <button
            className={style.menuButton}
            onClick={() => setVisibleMenu(!visibleMenu)}
            aria-label="메뉴 열기"
          >
            {visibleMenu ? <FiX className={style.icon} /> : <FiMenu className={style.icon} />}
          </button>
        </div>
      </div>

      {visibleMenu && (
        <div
          className={style.overlay}
          onClick={() => setVisibleMenu(false)}
          style={{ zIndex: 10000 }}
        >
          <div className={style.menuContainer} onClick={(e) => e.stopPropagation()}>
            <button
              className={style.closeButton}
              onClick={() => setVisibleMenu(false)}
              aria-label="메뉴 닫기"
            >
              <FiX className={style.closeIcon} />
            </button>
            {session ? (
              <div className={style.userInfo}>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={40}
                    height={40}
                    className={style.userInfoAvatar}
                  />
                ) : (
                  <div className={style.userInfoAvatarFallback}>
                    <FiUser size={20} />
                  </div>
                )}
                <div className={style.userInfoText}>
                  <div className={style.userName}>{session.user?.name || '사용자'}</div>
                  <div className={style.userEmail}>{session.user?.email}</div>
                </div>
              </div>
            ) : (
              <div className={style.loginPrompt}>
                <div className={style.loginPromptIcon}>
                  <FiUser size={24} />
                </div>
                <div className={style.loginPromptText}>
                  <div className={style.loginPromptTitle}>로그인하여 시작하세요</div>
                  <div className={style.loginPromptSubtitle}>
                    포토카드를 만들고 저장하려면 계정이 필요합니다
                  </div>
                </div>
                <div className={style.loginPromptActions}>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => handleClick('/login')}
                    className={style.loginPromptButton}
                  >
                    로그인
                  </Button>
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => handleClick('/register')}
                    className={style.loginPromptButtonSecondary}
                  >
                    회원가입
                  </Button>
                </div>
              </div>
            )}

            <ul className={style.menuWrap}>
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.divider ? (
                    <div className={style.menuDivider} />
                  ) : (
                    <button
                      className={style.menuItem}
                      onClick={() =>
                        item.action ? item.action() : item.route ? handleClick(item.route) : null
                      }
                    >
                      <span className={style.menuIcon}>{item.icon}</span>
                      <span className={style.menuLabel}>{item.label}</span>
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

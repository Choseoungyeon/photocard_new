'use client';

import style from './NavMenu.module.css';
import { FiAlignLeft, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function NavMenu() {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const router = useRouter();
  const handleClick = (route: string) => {
    router.push(route);
    setVisibleMenu(false);
  };
  return (
    <div className={style.navWrap}>
      <div className={style.wrap}>
        <h2 onClick={() => handleClick('/')}>Login</h2>
        <button onClick={() => setVisibleMenu(!visibleMenu)}>
          {visibleMenu ? <FiX className={style.icon} /> : <FiAlignLeft className={style.icon} />}
        </button>
      </div>

      {visibleMenu ? (
        <ul className={style.menuWrap}>
          <li onClick={() => handleClick('/login')}>login</li>
          <li onClick={() => handleClick('/register')}>register</li>
        </ul>
      ) : null}
    </div>
  );
}

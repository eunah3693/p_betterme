'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import hamBurger from '@public/assets/hamburger.svg'
import { usePathname } from 'next/navigation';
import { commonNavData, guestNavData, authNavData } from '@/constants/strings';
import logo from '@public/assets/logo.svg'
import { useUserStore } from '@/store/user';


function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();
    
    // 페이지 변경 시 모바일 메뉴 닫기
    setIsOpen(false);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-change', checkLoginStatus);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-change', checkLoginStatus);
      }
    };
  }, [pathname, user]);

  // 로그인 상태에 따라 메뉴 데이터 결합
  const navData = useMemo(() => {
    if (isLoggedIn) {
      return [...commonNavData, ...authNavData];
    } else {
      return [...commonNavData, ...guestNavData];
    }
  }, [isLoggedIn]);

  return (
    <nav className="bg-white flex justify-center  relative z-50">
      <div className="w-[1920px] max-w-full flex flex-wrap items-center justify-between px-4 py-2">
        <Link href="/" prefetch={false} className="flex items-center">
            <Image src={logo} alt="logo" width={120} height={40} className="h-12 w-auto max-w-[120px]" />
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none" 
          aria-controls="navbar-default" 
          aria-expanded={isOpen}
        >
            <Image src={hamBurger} alt="menu" width={20} height={20} className="w-5 h-5" />
        </button>
        <div className={`${isOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto md:right-auto w-full md:w-auto bg-white shadow-lg md:shadow-none`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:bg-white">
              {navData.map((item, index) => (
                <Link href={item.url} prefetch={true} key={index}>
                  <button
                    className="block py-2 text-info text-right"
                  >
                    {item.text}
                  </button>
                </Link>
              ))}
            </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

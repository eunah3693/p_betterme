import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import hamBurger from '@public/assets/hamburger.svg'
import { useRouter } from 'next/router';
import { navData } from '@/constants/strings';
import logo from '@public/assets/logo.svg'
import { isAuthenticated } from '@/lib/storage';


function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(isAuthenticated());
    };

    checkLoginStatus();
    
    // 페이지 변경 시마다 로그인 상태 확인
    const handleRouteChange = () => {
      checkLoginStatus();
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-change', checkLoginStatus);
    }
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-change', checkLoginStatus);
      }
    };
  }, [router]);

  return (
    <nav className="bg-white flex justify-center">
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
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:bg-white">
              {navData
                .filter((item) => {
                  // 로그인 상태: MY INFO만 표시
                  if (isLoggedIn) {
                    return item.text === 'MY INFO';
                  }
                  // 비로그인 상태: LOGIN, SIGN UP만 표시
                  return item.text === 'LOGIN' || item.text === 'SIGN UP';
                })
                .map((item, index) => (
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

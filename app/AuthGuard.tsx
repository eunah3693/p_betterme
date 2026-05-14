'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { getCurrentMember } from '@/functions/apis/member';

// 로그인 없이 접근 가능한 공개 페이지 목록
const PUBLIC_PATHS = ['/login',  '/signup', '/logout', '/blog', '/blog/myblog'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const setAuthChecked = useUserStore((state) => state.setAuthChecked);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 보호된 페이지 접근 시 로그인 체크
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      setAuthChecked(false);
      const isPublicPath = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/blog');

      try {
        const result = await getCurrentMember();

        if (!isMounted) return;

        if (result.success && result.data) {
          setUser(result.data);

          if (pathname === '/login' || pathname === '/signup') {
            router.push('/');
          }

          return;
        }

        logout();

        if (!isPublicPath) {
          router.push('/login');
        }
      } catch {
        if (!isMounted) return;

        logout();

        if (!isPublicPath) {
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setAuthChecked(true);
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [logout, pathname, router, setAuthChecked, setUser]);

  if (isCheckingAuth && !PUBLIC_PATHS.includes(pathname) && !pathname.startsWith('/blog')) {
    return null;
  }

  return <>{children}</>;
}

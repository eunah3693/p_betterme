'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

// 로그인 없이 접근 가능한 공개 페이지 목록
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/blog',
  '/blog/myblog'
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  // 보호된 페이지 접근 시 로그인 체크
  useEffect(() => {
    // hydration이 완료될 때까지 기다림
    if (!hasHydrated) return;
    
    // 정확히 일치하는 경로 또는 /blog로 시작하는 모든 경로는 공개
    const isPublicPath = PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/blog');
    
    if (!isPublicPath && !user) {
      router.push('/login');
    }
  }, [router, user, hasHydrated, pathname]);

  return <>{children}</>;
}

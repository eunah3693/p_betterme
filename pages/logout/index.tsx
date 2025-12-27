'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { useUserStore } from '@/store/user';

const LogoutPage = () => {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    // 로그아웃 처리
    logout();
    
    // 홈으로 리다이렉트
    router.push('/');
  }, []); // ⭐ 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={true} message="로그아웃 중" />
    </div>
  );
};

export default LogoutPage;

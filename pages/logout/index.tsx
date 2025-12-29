'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { useUserStore } from '@/store/user';

const LogoutPage = () => {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    logout(); 
    router.push('/');
  }, []); 

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={true} message="로그아웃 중" />
    </div>
  );
};

export default LogoutPage;

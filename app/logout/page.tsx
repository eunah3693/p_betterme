'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { useUserStore } from '@/store/user';
import { logout as requestLogout } from '@/functions/apis/member';

export default function LogoutPage() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    const runLogout = async () => {
      try {
        await requestLogout();
      } finally {
        logout(); 
        router.push('/');
      }
    };

    runLogout();
  }, [logout, router]); 

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={true} message="로그아웃 중" />
    </div>
  );
}

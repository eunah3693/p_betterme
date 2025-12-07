import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { removeUser } from '@/lib/storage';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    removeUser();
    
    router.push('/');
  }, [router]);

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={true} message="로그아웃 중" />
    </div>
  );
};

export default LogoutPage;

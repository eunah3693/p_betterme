import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import BlogRegister from '@/components/Diary/EditContent';
import type { DiaryFormData } from '@/components/Diary/RegisterContent';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import { getDiaryByIdx, updateDiary } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';
import { isAuthenticated, UserData } from '@/lib/storage';

const DiaryEditPage = () => {
  const router = useRouter();
  const { idx } = router.query;
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const currentUser = isAuthenticated();
    setUser(currentUser);
  }, [router]);

  const {
    data: diaryData,
    isLoading,
    error,
    refetch
  } = useQuery<DiaryItem | null, Error>({
    queryKey: ['diary', idx, user?.id],
    queryFn: async (): Promise<DiaryItem | null> => {
      if (!idx) return null;

      const result = await getDiaryByIdx(Number(idx));

      if (!result.success || !result.data) {
        return null;
      }

      if (Array.isArray(result.data)) {
        return result.data[0] || null;
      }

      return result.data as DiaryItem;
    },
    enabled: !!idx, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    retry: 2, 
  });

  const handleSubmit = async (data: DiaryFormData) => {
    try {
      if (!idx) {
        alert('잘못된 요청입니다.');
        return;
      }

      const result = await updateDiary({
        idx: Number(idx),
        subject: data.title,
        content: data.content,
        date: new Date()
      });

      if (result.success) {
        alert('일기가 수정되었습니다!');
        router.push('/diary');
      } else {
        alert(result.message || '수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('일기 수정 중 오류:', error);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="일기를 불러오는 중" />
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {error || !diaryData ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-main mb-6">일기 수정</h2>
              <BlogRegister 
                onSubmit={handleSubmit}
                initialData={{
                  title: diaryData.subject || '',
                  content: diaryData.content || ''
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryEditPage;
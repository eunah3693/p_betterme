import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Button from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import { getAllDiaries } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';
import { isAuthenticated } from '@/lib/storage';
import { UserData } from '@/interfaces/member';

const DiaryListPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const currentUser =  isAuthenticated();
    setUser(currentUser);
  }, [router]);

  const {
    data: diaryList = [],
    isLoading,
    error,
    refetch
  } = useQuery<DiaryItem[], Error>({
    queryKey: ['diaries', user?.id],
    queryFn: async (): Promise<DiaryItem[]> => {
      const result = await getAllDiaries({ memberId: user?.id || '' });

      if (!result.success || !result.data) {
        throw new Error('Failed to fetch diaries');
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5분간 신선
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2, // 실패 시 2번 재시도
  });

  const handleCardClick = (idx: number) => {
    router.push(`/diary/${idx}`);
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="일기를 불러오는 중" />
      <NavBar />
      <div className="flex justify-center py-10 md:py-15 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">

          <div className="mb-8 flex justify-between items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">일기</h1>
              <p className="text-gray-600 text-sm">오늘의 하루를 기록해주세요. 일기는 나만 볼 수 있습니다.</p>
            </div>
            <Button
              onClick={() => router.push('/diary/register')}
              color="bgMain"
              size="md"
              className="hover:bg-main/90 transition-colors whitespace-nowrap"
            >
              글쓰기
            </Button>
          </div>
          {error ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : diaryList.length === 0 ? (
            <NoContent message="작성된 일기가 없습니다." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diaryList.map((diary) => (
                <Card
                  key={diary.idx}
                  data={diary}
                  onClick={() => handleCardClick(diary.idx)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryListPage;


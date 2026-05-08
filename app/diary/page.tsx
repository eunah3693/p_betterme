'use client';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ButtonVariants } from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import { cn } from '@/constants/cn';
import { getAllDiaries } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';
import { useUserStore } from '@/store/user';

export default function DiaryListPage() {
  const user = useUserStore((state) => state.user);

  const { data: diaryList = [], isLoading } = useQuery<DiaryItem[], Error>({
    queryKey: ['diary', user?.id],
    queryFn: async (): Promise<DiaryItem[]> => {
      const result = await getAllDiaries();
      if (!result.success || !result.data) {
        throw new Error('Failed to fetch diaries');
      }

      return result.data;
    },
    enabled: !!user,
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="일기를 불러오는 중" />
      <div className="flex justify-center py-10 md:py-15 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">

          <div className="mb-8 flex justify-between items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">일기</h1>
              <p className="text-gray-600 text-sm">오늘의 하루를 기록해주세요. 일기는 나만 볼 수 있습니다.</p>
            </div>
            <Link
              href="/diary/register"
              className={cn(
                ButtonVariants({ color: 'bgMain', size: 'md' }),
                'inline-block text-center hover:bg-main/90 transition-colors whitespace-nowrap',
              )}
            >
              글쓰기
            </Link>
          </div>
          {diaryList.length === 0 ? (
            <NoContent message="작성된 일기가 없습니다." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diaryList.map((diary) => (
                <Card
                  key={diary.idx}
                  data={diary}
                  url={'/diary/'+diary.idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

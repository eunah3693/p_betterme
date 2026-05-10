import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ButtonVariants } from '@/components/Buttons/Button';
import { cn } from '@/constants/cn';
import { getNextDiaryPageParam } from '@/functions/apis/diary';
import { requireAuthUserFromCookies } from '@/lib/auth';
import { DiaryService } from '@/services/diaryService';
import DiaryListClient from './DiaryListClient';

export default async function DiaryListPage() {
  const queryClient = new QueryClient();
  const user = await requireAuthUserFromCookies().catch(() => {
    redirect('/login');
  });

  if (user) {
    const diaryService = new DiaryService();

    await queryClient.prefetchInfiniteQuery({
      queryKey: ['diary'],
      queryFn: ({ pageParam = 0 }) =>
        diaryService.getDiaries(user.id, { page: pageParam as number }),
      getNextPageParam: getNextDiaryPageParam,
      initialPageParam: 0,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex justify-center px-4 py-10 md:py-15">
        <div className="w-[90%] max-w-[1200px] md:w-[90%] lg:w-[1200px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-main">일기</h1>
              <p className="text-sm text-gray-600">
                오늘의 하루를 기록해주세요. 일기는 나만 볼 수 있습니다.
              </p>
            </div>
            <Link
              href="/diary/register"
              className={cn(
                ButtonVariants({ color: 'bgMain', size: 'md' }),
                'inline-block whitespace-nowrap text-center transition-colors hover:bg-main/90'
              )}
            >
              글쓰기
            </Link>
          </div>

          <DiaryListClient />
        </div>
      </div>
    </HydrationBoundary>
  );
}

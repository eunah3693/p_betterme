import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import Button from '@/components/Buttons/Button';
import { getAllDiaries } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';

const DiaryListPage = () => {
  const router = useRouter();

  const {
    data: diaryList = [],
    isLoading,
    error,
    refetch
  } = useQuery<DiaryItem[], Error>({
    queryKey: ['diaries'],
    queryFn: async (): Promise<DiaryItem[]> => {
      const result = await getAllDiaries();

      if (!result.success || !result.data) {
        throw new Error('Failed to fetch diaries');
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5분간 신선
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2, // 실패 시 2번 재시도
  });

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const getTruncatedContent = (content: string) => {
    const text = stripHtml(content);
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const first3Lines = lines.slice(0, 3).join('\n');
    
    if (lines.length > 3) {
      return first3Lines + '...';
    }
    return first3Lines;
  };

  const handleCardClick = (idx: number) => {
    router.push(`/diary/${idx}`);
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">

          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">일기</h1>
              <p className="text-gray-600">나의 하루를 기록합니다</p>
            </div>
            <Button
              onClick={() => router.push('/diary/register')}
              color="bgMain"
              size="lg"
              className="hover:bg-main/90 transition-colors whitespace-nowrap"
            >
              글쓰기
            </Button>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
                <p className="text-gray-600">일기 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center text-red-500">
                <p>데이터를 불러오는데 실패했습니다.</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-main text-white rounded"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : diaryList.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-4">작성된 일기가 없습니다.</p>
                <Button
                  onClick={() => router.push('/diary/register')}
                  color="bgMain"
                  size="md"
                >
                  첫 일기 작성하기
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diaryList.map((diary) => (
                <div
                  key={diary.idx}
                  onClick={() => handleCardClick(diary.idx)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-main mb-4 truncate">
                      {diary.subject || '제목 없음'}
                    </h2>
                    <hr className="mb-4 border-gray-200" />
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-3">
                      {getTruncatedContent(diary.content || '')}
                    </p>
                    {diary.date && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {new Date(diary.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryListPage;


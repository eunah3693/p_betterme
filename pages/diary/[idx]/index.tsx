import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import BlogView from '@/components/Blog/ViewContent';
import { getDiaryByIdx } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';

const DiaryDetailPage = () => {
  const router = useRouter();
  const { idx } = router.query;

  const {
    data: diaryData,
    isLoading,
    error,
    refetch
  } = useQuery<DiaryItem | null, Error>({
    queryKey: ['diary', idx],
    queryFn: async (): Promise<DiaryItem | null> => {
      if (!idx) return null;

      const result = await getDiaryByIdx(Number(idx));

      if (!result.success || !result.data) {
        return null;
      }

      // result.data가 배열인 경우와 단일 객체인 경우 처리
      if (Array.isArray(result.data)) {
        return result.data[0] || null;
      }

      return result.data as DiaryItem;
    },
    enabled: !!idx, // idx가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분간 신선
    gcTime: 1000 * 60 * 10, // 10분간 캐시 유지
    retry: 2, // 실패 시 2번 재시도
  });

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {/* 뒤로 가기 버튼 */}
          <button
            onClick={() => router.push('/diary')}
            className="mb-4 text-main hover:text-main/80 transition-colors flex items-center gap-2"
          >
            ← 목록으로 돌아가기
          </button>

          {/* 로딩 중 */}
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
                <p className="text-gray-600">일기를 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            /* 에러 발생 */
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h1 className="text-2xl font-bold text-red-500 mb-4">오류가 발생했습니다</h1>
              <p className="text-gray-600 mb-6">일기를 불러오는데 실패했습니다.</p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-main text-white rounded hover:bg-main/90 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : !diaryData ? (
            /* 일기를 찾을 수 없음 */
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">일기를 찾을 수 없습니다</h1>
              <p className="text-gray-600 mb-6">요청하신 일기가 존재하지 않습니다.</p>
              <button
                onClick={() => router.push('/diary')}
                className="px-6 py-2 bg-main text-white rounded hover:bg-main/90 transition-colors"
              >
                목록으로 돌아가기
              </button>
            </div>
          ) : (
            /* 일기 내용 표시 */
            <>
              <BlogView 
                title={diaryData.subject || '제목 없음'}
                content={diaryData.content || ''}
              />

              {/* 날짜 정보 */}
              {diaryData.date && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    작성일: {new Date(diaryData.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryDetailPage;


'use client';
import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BlogView from '@/components/Diary/ViewContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import { getDiaryByIdx, deleteDiary } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';
import Button, { ButtonVariants } from '@/components/Buttons/Button';
import { useModal } from '@/functions/hooks/useModal';
import { useDebugInfo } from '@/functions/hooks/useDebugInfo';
import { cn } from '@/constants/cn';

export default function DiaryDetailPage({
  params,
}: {
  params: Promise<{ idx: string }>;
}) {
  const router = useRouter();
  const { idx } = use(params);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: diaryData,
    isLoading,
    error,
    refetch
  } = useQuery<DiaryItem | null, Error>({
    queryKey: ['diary', idx],
    queryFn: async (): Promise<DiaryItem | null> => {
      if (!idx){
        throw new Error('Failed to fetch diaries');
      }

      const result = await getDiaryByIdx(Number(idx));

      if (!result.success || !result.data) {
        throw new Error('Failed to fetch diaries');
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

  useDebugInfo('DiaryDetail', {
    idx,
    status: isLoading ? 'loading' : error ? 'error' : diaryData ? 'loaded' : 'empty',
    isDeleting,
  });

  // 삭제 
  const handleDelete = async () => {
    if (!idx) return;

    try {
      setIsDeleting(true);
      const result = await deleteDiary(Number(idx));

      if (result.success) {
        showModal('일기가 삭제되었습니다.', 'success', () => {
          queryClient.invalidateQueries({ 
            queryKey: ['diary'] 
          });
          router.push('/diary');
        });
      } else {
        showModal(result.message || '삭제에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('일기 삭제 중 오류:', error);
      showModal('삭제에 실패했습니다.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="일기를 불러오는 중" />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {isLoading ? null : error || !diaryData ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : (
            <>
              <BlogView 
                data={diaryData}
              />
              <div className="flex gap-3 justify-end pt-4">
                  <Button
                    size="sm"
                    color="bMain"
                    onClick={() => router.back()}
                  >
                    목록
                  </Button>
                  <Link
                    href={`/diary/${diaryData.idx}/update`}
                    className={cn(
                      ButtonVariants({ color: 'bgMain', size: 'sm' }),
                      'inline-block text-center',
                    )}
                  >
                    수정
                  </Link>
                  <Button
                    size="sm"
                    color="bgDanger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        message={modal.message}
        type={modal.type}
      />
    </>
  );
}

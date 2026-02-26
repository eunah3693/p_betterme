'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BlogRegister from '@/components/Diary/RegisterTipTapContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import type { DiaryFormData } from '@/components/Diary/RegisterContent';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import { getDiaryByIdx, updateDiary } from '@/functions/apis/diary';
import type { DiaryItem } from '@/interfaces/diary';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';

export default function DiaryEditPage({
  params,
}: {
  params: { idx: string };
}) {
  const router = useRouter();
  const idx = params.idx;
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();

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
        showModal('잘못된 요청입니다.', 'error');
        return;
      }

      const result = await updateDiary({
        idx: Number(idx),
        subject: data.title,
        content: data.content,
        date: new Date()
      });

      if (result.success) {
        showModal('일기가 수정되었습니다.', 'success', () => {
          queryClient.invalidateQueries({ 
            queryKey: ['diary', user?.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['diary', idx] 
          });
          router.push('/diary');
        });
      } else {
        showModal(result.message || '수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('일기 수정 중 오류:', error);
      showModal('수정에 실패했습니다.', 'error');
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="일기를 불러오는 중" />
      
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

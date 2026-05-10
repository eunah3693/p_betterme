'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BlogRegister, { type DiaryFormData } from '@/components/Diary/RegisterTipTapContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { createDiary } from '@/functions/apis/diary';
import { useModal } from '@/functions/hooks/useModal';

export default function DiaryWritePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();

  const createDiaryMutation = useMutation({
    mutationFn: createDiary,
    onSuccess: (result) => {
      if (result.success) {
        showModal('일기가 등록되었습니다.', 'success', () => {
          queryClient.invalidateQueries({
            queryKey: ['diary']
          });
          router.push('/diary');
        });
      } else {
        showModal(result.message || '등록에 실패했습니다.', 'error');
      }
    },
    onError: (error) => {
      console.error('일기 등록 중 오류:', error);
      showModal('등록에 실패했습니다.', 'error');
    },
  });

  const handleSubmit = (data: DiaryFormData) => {
    createDiaryMutation.mutate({
      subject: data.title,
      content: data.content,
      date: new Date()
    });
  };

  return (
    <>
      <LoadingOverlay
        isLoading={createDiaryMutation.isPending}
        message="일기를 등록하는 중"
      />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%] bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-main mb-6">오늘 하루 일기쓰기</h2>
          <BlogRegister onSubmit={handleSubmit} />
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

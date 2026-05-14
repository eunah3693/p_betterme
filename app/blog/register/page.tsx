'use client';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import BlogRegister from '@/components/Blog/RegisterTipTapContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import type { BlogFormData } from '@/components/Blog/RegisterTipTapContent';
import { createBlog, getCategories } from '@/functions/apis/blog';
import { useModal } from '@/functions/hooks/useModal';
import type { BlogCategoryItem } from '@/interfaces/blog';

export default function BlogWritePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user) {
      router.push('/login');
    }
  }, [isAuthChecked, user, router]);


  // 로그인한 사용자의 카테고리 목록 조회
  const { data: categoryData } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => getCategories(user!.id),
    enabled: !!user?.id,
  });

  const rawCategories = categoryData?.data;
  const categories: BlogCategoryItem[] = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories != null
      ? [rawCategories]
      : [];

  const createBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (result) => {
      if (result.success) {
        showModal('블로그가 등록되었습니다.', 'success', () => {
          queryClient.invalidateQueries({
            queryKey: ['myblog', user?.id],
          });
          router.push(`/blog/myblog?id=${user?.id}`);
        });
      } else {
        showModal(result.message || '등록에 실패했습니다.', 'error');
      }
    },
    onError: (error) => {
      console.error('블로그 등록 중 오류:', error);
      showModal('등록에 실패했습니다.', 'error');
    },
  });

  const handleSubmit = (data: BlogFormData) => {
      if(!user?.id){
        showModal('로그인을 시도해주세요.', 'error');
        return;
      }

      createBlogMutation.mutate({
        memberId: user?.id,
        subject: data.title,
        content: data.content,
        date: new Date(),
        categoryIdx: selectedCategoryIdx ?? undefined,
      });
  };

  return (
    <>
      <LoadingOverlay
        isLoading={createBlogMutation.isPending}
        message="블로그를 등록하는 중"
      />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%] bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-main mb-6">블로그 글 작성</h2>

          <BlogRegister
            onSubmit={handleSubmit}
            categories={categories}
            selectedCategoryIdx={selectedCategoryIdx}
            onCategoryChange={setSelectedCategoryIdx}
          />
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

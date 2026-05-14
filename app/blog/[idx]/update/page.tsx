'use client';
import React, { use, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BlogRegister from '@/components/Blog/RegisterTipTapContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import type { BlogFormData } from '@/components/Blog/RegisterTipTapContent';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import NoContent from '@/components/Empty/NoContent';
import { getBlogByIdx, updateBlog } from '@/functions/apis/blog';
import type { BlogItem } from '@/interfaces/blog';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';

export default function BlogEditPage({
  params,
}: {
  params: Promise<{ idx: string }>;
}) {
  const router = useRouter();
  const { idx } = use(params);
  const user = useUserStore((state) => state.user);
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();
  const hasShownUnauthorizedRef = useRef(false);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!user) {
      router.push('/login');
    }
  }, [isAuthChecked, user, router]);

  const {
    data: blogData,
    isLoading
  } = useQuery<BlogItem | null, Error>({
    queryKey: ['blog', idx],
    queryFn: async (): Promise<BlogItem | null> => {
      if (!idx) return null;

      const result = await getBlogByIdx(Number(idx));

      if (!result.success || !result.data) {
        return null;
      }

      if (Array.isArray(result.data)) {
        return result.data[0] || null;
      }

      return result.data as BlogItem;
    },
    enabled: !!idx && !!user?.id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  const isAuthor =
    blogData?.memberId != null && user?.id != null && blogData.memberId === user.id;

  useEffect(() => {
    if (isLoading || !blogData || !user?.id || isAuthor || hasShownUnauthorizedRef.current) {
      return;
    }

    hasShownUnauthorizedRef.current = true;
    showModal('작성자가 아닙니다.', 'error', () => {
      router.replace(`/blog/${idx}`);
    });
  }, [blogData, idx, isAuthor, isLoading, router, showModal, user?.id]);

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (result) => {
      if (result.success) {
        showModal('블로그가 수정되었습니다.', 'success', () => {
          queryClient.invalidateQueries({
            queryKey: ['myblog', user?.id]
          });
          queryClient.invalidateQueries({
            queryKey: ['blog', idx]
          });
          router.push(`/blog/myblog?id=${user?.id}`);
        });
      } else {
        showModal(result.message || '수정에 실패했습니다.', 'error');
      }
    },
    onError: (error) => {
      console.error('블로그 수정 중 오류:', error);
      showModal('수정에 실패했습니다.', 'error');
    },
  });

  const handleSubmit = (data: BlogFormData) => {
      if (!idx || !user?.id) {
        showModal('잘못된 요청입니다.', 'error');
        return;
      }

      if (!blogData || !isAuthor) {
        showModal('작성자가 아닙니다.', 'error');
        return;
      }

      updateBlogMutation.mutate({
        idx: Number(idx),
        memberId: user.id,
        subject: data.title,
        content: data.content,
        date: new Date()
      });
  };

  return (
    <>
      <LoadingOverlay
        isLoading={isLoading || updateBlogMutation.isPending}
        message={isLoading ? '블로그를 불러오는 중' : '블로그를 수정하는 중'}
      />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {!isLoading && !blogData ? (
            <NoContent message="게시글을 찾을 수 없습니다." />
          ) : blogData && isAuthor ? (
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-main mb-6">블로그 수정</h2>
              <BlogRegister 
                onSubmit={handleSubmit}
                initialData={{
                  title: blogData.subject || '',
                  content: blogData.content || ''
                }}
              />
            </div>
          ) : null}
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

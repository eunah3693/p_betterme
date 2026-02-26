'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BlogView from '@/components/Blog/ViewContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import { getBlogByIdx, deleteBlog } from '@/functions/apis/blog';
import type { BlogItem } from '@/interfaces/blog';
import Button from '@/components/Buttons/Button';
import { useModal } from '@/functions/hooks/useModal';
import { useUserStore } from '@/store/user';

export default function BlogDetailClient({ idx }: { idx: string }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: blogData,
    isLoading,
    error,
    refetch
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
    enabled: !!idx, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    retry: 2,
  });

  const handleDelete = async () => {
    if (!idx) return;

    try {
      setIsDeleting(true);
      const result = await deleteBlog(Number(idx));

      if (result.success) {
        showModal('블로그가 삭제되었습니다.', 'success', () => {
          queryClient.invalidateQueries({ 
            queryKey: ['myblog', user?.id] 
          });
          router.push(`/blog/myblog?id=${user?.id}`);
        });
      } else {
        showModal(result.message || '삭제에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('블로그 삭제 중 오류:', error);
      showModal('삭제에 실패했습니다.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {error ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : blogData && (
            <div>
              <div className="flex justify-between items-center pb-4">
                <Button
                  size="sm"
                  color="bgMain"
                  onClick={() => router.back()}
                >
                  목록
                </Button>
                {blogData?.isAuthor && (
                    <div className="flex gap-3 justify-end">
                      <Button
                        size="sm"
                        color="bgMain"
                        onClick={() => router.push(`/blog/${blogData.idx}/update`)}
                      >
                        수정
                      </Button>
                      <Button
                        size="sm"
                        color="bgSub"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? '삭제 중...' : '삭제'}
                      </Button>
                    </div>
                  )}
              </div>
              <div className="flex-1">
                <BlogView 
                  data={blogData}
                />
              </div>
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

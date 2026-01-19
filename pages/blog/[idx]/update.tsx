import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import BlogRegister from '@/components/Blog/RegisterContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import type { BlogFormData } from '@/components/Blog/RegisterContent';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import { getBlogByIdx, updateBlog } from '@/functions/apis/blog';
import type { BlogItem } from '@/interfaces/blog';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';

const BlogEditPage = () => {
  const router = useRouter();
  const { idx } = router.query;
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const {
    data: blogData,
    isLoading
  } = useQuery<BlogItem | null, Error>({
    queryKey: ['blog', idx, user?.id],
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

  const handleSubmit = async (data: BlogFormData) => {
    try {
      if (!idx) {
        showModal('잘못된 요청입니다.', 'error');
        return;
      }

      const result = await updateBlog({
        idx: Number(idx),
        memberId: user?.id || '',
        subject: data.title,
        content: data.content,
        date: new Date()
      });

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
    } catch (error) {
      console.error('블로그 수정 중 오류:', error);
      showModal('수정에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {blogData &&(
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
    </div>
  );
};

export default BlogEditPage;


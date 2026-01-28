import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useUserStore } from '@/store/user';
import BlogRegister from '@/components/Blog/RegisterTipTapContent';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import type { BlogFormData } from '@/components/Blog/RegisterTipTapContent';
import { createBlog } from '@/functions/apis/blog';
import { useModal } from '@/functions/hooks/useModal';


const BlogWritePage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { modal, showModal, closeModal } = useModal(); // modal hook

  const handleSubmit = async (data: BlogFormData) => {
    try {
      const result = await createBlog({
        memberId: user?.id || '',
        subject: data.title,
        content: data.content,
        date: new Date() // YYYY-MM-DD
      });

      if (result.success) {
        showModal('블로그가 등록되었습니다.', 'success', () => {
          queryClient.invalidateQueries({ 
            queryKey: ['myblog', user?.id] 
          });
          router.push(`/blog/myblog?id=${user?.id}`);
        });
      } else {
        showModal(result.message || '등록에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('블로그 등록 중 오류:', error);
      showModal('등록에 실패했습니다.', 'error');
    }
  };

  return (
    <>
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%] bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-main mb-6">블로그 글 작성</h2>
          
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
};

export default BlogWritePage;


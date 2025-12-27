import React from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import BlogRegister from '@/components/Blog/RegisterContent';
import type { BlogFormData } from '@/components/Blog/RegisterContent';
import { createBlog } from '@/functions/apis/blog';

const BlogWritePage = () => {
  const router = useRouter();

  const handleSubmit = async (data: BlogFormData) => {
    try {
      const result = await createBlog({
        memberId: 'test',
        subject: data.title,
        content: data.content,
        date: new Date() // YYYY-MM-DD
      });

      if (result.success) {
        alert('블로그가 등록되었습니다!');
        router.push('/blog/myblog');
      } else {
        alert(result.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('블로그 등록 중 오류:', error);
      alert('등록에 실패했습니다.');
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%] bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-main mb-6">블로그 글 작성</h2>
          <BlogRegister onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default BlogWritePage;


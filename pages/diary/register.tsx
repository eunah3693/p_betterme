import React from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import BlogRegister from '@/components/Diary/RegisterContent';
import type { DiaryFormData } from '@/components/Diary/RegisterContent';
import { createDiary } from '@/functions/apis/diary';
import { isAuthenticated } from '@/lib/storage';

const DiaryWritePage = () => {
  const router = useRouter();

  useEffect(() => {
    isAuthenticated();
  }, [router]);

  const handleSubmit = async (data: DiaryFormData) => {
    try {
      const result = await createDiary({
        subject: data.title,
        content: data.content,
        date: new Date()
      });

      if (result.success) {
        alert('일기가 등록되었습니다!');
        router.push('/diary');
      } else {
        alert(result.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('일기 등록 중 오류:', error);
      alert('등록에 실패했습니다.');
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%] bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-main mb-6">오늘 하루 일기쓰기</h2>
          <BlogRegister onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default DiaryWritePage;


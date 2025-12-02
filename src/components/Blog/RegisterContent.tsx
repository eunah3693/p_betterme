import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/constants/cn';
import Input from '@/components/Forms/Input';
import 'react-quill-new/dist/quill.snow.css';

// React Quill을 동적으로 import (Next.js SSR 문제 해결)
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p className="h-[400px] flex items-center justify-center">에디터 로딩 중...</p>
});

interface BlogRegisterProps {
  onSubmit?: (data: BlogFormData) => void;
  initialData?: Partial<BlogFormData>;
  className?: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  thumbnail?: string;
}

function BlogRegister({
  onSubmit,
  initialData,
  className
}: BlogRegisterProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');

  // Quill 에디터 설정
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }
    
    if (!content.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    const formData: BlogFormData = {
      title,
      content,
      thumbnail: thumbnail || undefined,
    };

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('bg-white rounded-lg shadow-sm p-6 md:p-8', className)}>
      <h2 className="text-2xl font-bold text-main mb-6">블로그 글 작성</h2>

      {/* 제목 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="블로그 제목을 입력하세요"
          size="lg"
          color="bMain"
        />
      </div>


      {/* 내용 입력 (Quill 에디터) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내용 <span className="text-red-500">*</span>
        </label>
        <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요..."
            className="h-[400px]"
          />
        </div>
        <div className="mt-16"></div> {/* Quill 에디터 하단 여백 */}
      </div>


      {/* 제출 버튼 */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-main text-white rounded hover:bg-main/90 transition-colors"
        >
          등록하기
        </button>
      </div>
    </form>
  );
}

export default BlogRegister;

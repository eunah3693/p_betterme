import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/constants/cn';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';
import 'react-quill-new/dist/quill.snow.css';

// React Quill을 동적으로 import (Next.js SSR 문제 해결)
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p className="h-[400px] flex items-center justify-center">에디터 로딩 중...</p>
});

interface BlogRegisterProps {
  onSubmit?: (data: DiaryFormData) => void;
  initialData?: Partial<DiaryFormData>;
  className?: string;
}

export interface DiaryFormData {
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
  const thumbnail = initialData?.thumbnail || '';

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

    const formData: DiaryFormData = {
      title,
      content,
      thumbnail: thumbnail || undefined,
    };

    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('', className)}>
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          size="md"
          color="bMain"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          내용 <span className="text-red-500">*</span>
        </label>
        <div className="bg-white border border-main rounded-md overflow-hidden">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요"
            className="h-[400px]"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          size="md"
          color="bMain"
          onClick={() => window.history.back()}
          className="hover:bg-gray-600 transition-colors"
        >
          취소
        </Button>
        <Button
          type="submit"
          size="md"
          color="bgMain"
          className="hover:bg-main/90 transition-colors"
        >
          저장하기
        </Button>
      </div>
    </form>
  );
}

export default BlogRegister;

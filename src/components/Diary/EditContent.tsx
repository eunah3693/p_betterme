import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/constants/cn';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useModal } from '@/functions/hooks/useModal';
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
  const thumbnail = initialData?.thumbnail || '';
  const { modal, showModal, closeModal } = useModal();

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
    'list',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showModal('제목을 입력해주세요!', 'error');
      return;
    }
    
    if (!content.trim()) {
      showModal('내용을 입력해주세요!', 'error');
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
    <>
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
          <div className="bg-white border border-main rounded-md overflow-hidden quill-editor-wrapper">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="내용을 입력하세요"
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
            수정하기
          </Button>
        </div>
      </form>
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

export default BlogRegister;

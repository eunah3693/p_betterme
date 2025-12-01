import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/constants/cn';
import Input from '@/components/Forms/Input';
import Select from '@/components/Forms/Select';
import Badge from '@/components/Forms/Badge';
import 'react-quill/dist/quill.snow.css';

// React Quill을 동적으로 import (Next.js SSR 문제 해결)
const ReactQuill = dynamic(() => import('react-quill'), { 
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
  author: string;
  category: string;
  tags: string[];
  thumbnail?: string;
}

function BlogRegister({
  onSubmit,
  initialData,
  className
}: BlogRegisterProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');

  // 카테고리 옵션
  const categoryOptions = [
    { value: '', label: '카테고리 선택' },
    { value: '공지사항', label: '공지사항' },
    { value: '개발', label: '개발' },
    { value: '디자인', label: '디자인' },
    { value: '문화행사', label: '문화행사' },
    { value: '기타', label: '기타' },
  ];

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

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 엔터키로 태그 추가
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

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
      author: author || '관리자',
      category,
      tags,
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

      {/* 작성자 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작성자
        </label>
        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자 이름 (기본: 관리자)"
          size="md"
          color="bMain"
        />
      </div>

      {/* 카테고리 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
          size="md"
          color="bMain"
        />
      </div>

      {/* 썸네일 URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          썸네일 이미지 URL
        </label>
        <Input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="이미지 URL을 입력하세요"
          size="md"
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

      {/* 태그 입력 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          태그
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="태그를 입력하고 Enter를 누르세요"
            size="md"
            color="bMain"
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-main text-white rounded hover:bg-main/90 transition-colors whitespace-nowrap"
          >
            추가
          </button>
        </div>
        
        {/* 태그 목록 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="solid"
                color="bInfo"
                size="sm"
                className="cursor-pointer hover:opacity-80"
                onClick={() => handleRemoveTag(tag)}
              >
                #{tag} ✕
              </Badge>
            ))}
          </div>
        )}
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

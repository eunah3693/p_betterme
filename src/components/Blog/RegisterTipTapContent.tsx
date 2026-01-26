import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Image from 'next/image';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { cn } from '@/constants/cn';
import { TEXT_COLORS, BACKGROUND_COLORS, HEADING_LEVELS } from '@/constants/tiptapStyle';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useModal } from '@/functions/hooks/useModal';
import alignLeft from '@assets/left_align.svg';
import alignCenter from '@assets/center_align.svg';
import alignRight from '@assets/right_align.svg';
import alignJustify from '@assets/align.svg';
import b from '@assets/b.svg';
import i from '@assets/i.svg';
import u from '@assets/u.svg';
import s from '@assets/s.svg';
import ol from '@assets/ol.svg';
import ul from '@assets/ul.svg';

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
  const thumbnail = initialData?.thumbnail || '';
  const { modal, showModal, closeModal } = useModal();

  // TipTap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
    ],
    content: initialData?.content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showModal('제목을 입력해주세요!', 'error');
      return;
    }
    
    const content = editor?.getHTML() || '';
    if (!content.trim() || content === '<p></p>') {
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
          <div className="bg-white border border-main rounded-md overflow-hidden">
            {/* TipTap Toolbar */}
            {editor && (
              <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1 bg-gray-50">
                {/* 헤딩 */}
                <select
                  onChange={(e) => {
                    const level = parseInt(e.target.value);
                    if (level === 0) {
                      editor.chain().focus().setParagraph().run();
                    } else {
                      editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                    }
                    e.target.value = '0';
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {HEADING_LEVELS.map((heading) => (
                    <option key={heading.value} value={heading.value}>
                      {heading.label}
                    </option>
                  ))}
                </select>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* 텍스트 스타일 */}
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 font-bold',
                    editor.isActive('bold') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="굵게 (Ctrl+B)"
                >
                  <Image src={b} alt="굵게" width={16} height={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 italic',
                    editor.isActive('italic') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="기울임 (Ctrl+I)"
                >
                  <Image src={i} alt="기울임" width={16} height={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 underline',
                    editor.isActive('underline') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="밑줄 (Ctrl+U)"
                >
                  <Image src={u} alt="밑줄" width={16} height={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 line-through',
                    editor.isActive('strike') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="취소선"
                >
                  <Image src={s} alt="취소선" width={16} height={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* 텍스트 색상 */}
                <div className="flex gap-1">
                  {TEXT_COLORS.map((colorOption) => (
                    <button
                      key={colorOption.color}
                      type="button"
                      onClick={() => editor.chain().focus().setColor(colorOption.color).run()}
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                      style={{ color: colorOption.color, borderColor: colorOption.color }}
                      title={colorOption.name}
                    >
                     T
                    </button>
                  ))}
                </div>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* 형광펜 (배경 색상) */}
                <div className="flex gap-1">
                  {BACKGROUND_COLORS.map((bgColorOption) => (
                    <button
                      key={bgColorOption.color}
                      type="button"
                      onClick={() => editor.chain().focus().toggleHighlight({ color: bgColorOption.color }).run()}
                      className={cn(
                        'w-6 h-6 rounded hover:opacity-80',
                        editor.isActive('highlight', { color: bgColorOption.color }) ? 'ring-2 ring-blue-500' : ''
                      )}
                      style={{ backgroundColor: bgColorOption.color }}
                      title={`형광펜 - ${bgColorOption.name}`}
                    >
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* 정렬 */}
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 text-sm leading-none',
                    editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="왼쪽 정렬"
                >
                  <span className="block text-left" style={{ lineHeight: '1.2' }}>
                    <Image src={alignLeft} alt="왼쪽 정렬" width={16} height={16} />
                  </span>
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 text-sm leading-none',
                    editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="가운데 정렬"
                >
                  <span className="block text-center" style={{ lineHeight: '1.2' }}>
                    <Image src={alignCenter} alt="가운데 정렬" width={16} height={16} />
                  </span>
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 text-sm leading-none',
                    editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="오른쪽 정렬"
                >
                  <span className="block text-right" style={{ lineHeight: '1.2' }}>
                    <Image src={alignRight} alt="오른쪽 정렬" width={16} height={16} />
                  </span>
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 text-sm leading-none',
                    editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="양쪽 정렬"
                >
                  <span className="block text-left" style={{ lineHeight: '1.2' }}>
                    <Image src={alignJustify} alt="양쪽 정렬" width={16} height={16} />
                  </span>
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* 리스트 */}
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200',
                    editor.isActive('bulletList') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="글머리 기호"
                >
                    <Image src={ul} alt="번호 매기기" width={16} height={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200',
                    editor.isActive('orderedList') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="번호 매기기"
                >
                  <Image src={ol} alt="글머리 기호" width={16} height={16} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* 코드 */}
                <button
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 font-mono',
                    editor.isActive('codeBlock') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="코드 블록"
                >
                  {'</>'}
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={cn(
                    'px-3 py-1 rounded hover:bg-gray-200 font-mono text-sm',
                    editor.isActive('code') ? 'bg-gray-300' : ''
                  )}
                  type="button"
                  title="인라인 코드"
                >
                  `code`
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* 수평선 */}
                <button
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className="px-3 py-1 rounded hover:bg-gray-200"
                  type="button"
                  title="수평선"
                >
                  ─
                </button>
              </div>
            )}

            {/* TipTap Editor */}
            <EditorContent editor={editor} className="bg-white" />
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

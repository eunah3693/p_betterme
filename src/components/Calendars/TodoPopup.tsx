import React, { useState, useEffect } from 'react';
import { cn } from '@/constants/cn';
import Button from '@/components/Buttons/Button';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';

interface TodoItem {
  id: number;
  text: string;
  content?: string;
  completed: boolean;
}

interface TodoPopupProps {
  isOpen: boolean;
  selectedDate: Date | null;
  todos: TodoItem[];
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => void;
  onUpdate: (id: number, data: { title: string; content: string }) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

function TodoPopup({
  isOpen,
  selectedDate,
  todos,
  onClose,
  onSubmit,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TodoPopupProps) {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 팝업이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setEditingTodoId(null);
      setTitle('');
      setContent('');
    }
  }, [isOpen]);

  if (!isOpen || !selectedDate) return null;

  const handleTodoClick = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setTitle(todo.text);
    setContent(todo.content || '');
  };

  const handleEditClick = (todo: TodoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleTodoClick(todo);
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
      console.log('delete', id);
      if (editingTodoId === id) {
        setEditingTodoId(null);
        setTitle('');
        setContent('');
      }
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요!');
      return;
    }

    if (editingTodoId) {
      // 수정 모드
      onUpdate(editingTodoId, { title, content });
      setEditingTodoId(null);
    } else {
      // 등록 모드
      onSubmit({ title, content });
    }
    
    setTitle('');
    setContent('');
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setTitle('');
    setContent('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <>
      {/* 배경 dim */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* 팝업 */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="bg-main text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{formatDate(selectedDate)}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="overflow-y-auto max-h-[calc(80vh-88px)]">
          {/* 할일 목록 */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">할 일 목록</h3>
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                등록된 할 일이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => handleTodoClick(todo)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
                      editingTodoId === todo.id
                        ? 'bg-blue-50 border-2 border-main'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          onToggleComplete(todo.id);
                        }}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span
                        className={cn(
                          'font-medium truncate',
                          todo.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-800'
                        )}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleEditClick(todo, e)}
                        color="bgMain"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        수정
                      </Button>
                      <Button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteClick(todo.id, e)}
                        color="bgDanger"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 등록/수정 폼 */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingTodoId ? '할 일 수정' : '할 일 추가'}
            </h3>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="할 일 제목을 입력하세요"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="할 일 내용을 입력하세요 (선택사항)"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  color="bgMain"
                  size="md"
                  className="flex-1"
                >
                  {editingTodoId ? '수정하기' : '등록하기'}
                </Button>
                {editingTodoId && (
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    color="bgGray"
                    size="md"
                    className="flex-1"
                  >
                    취소
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoPopup;


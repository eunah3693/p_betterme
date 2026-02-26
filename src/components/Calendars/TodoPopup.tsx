'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { cn } from '@/constants/cn';
import Button from '@/components/Buttons/Button';
import Input from '@/components/Forms/Input';
import Textarea from '@/components/Forms/Textarea';
import InputDatepicker from '@/components/Forms/InputDatepicker';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { useModal } from '@/functions/hooks/useModal';

interface TodoItem {
  id: number;
  text: string;
  content?: string;
  completed: boolean;
  startDate?: string;
  finishDate?: string;
}

interface TodoPopupProps {
  isOpen: boolean;
  selectedDate: Date | null;
  todos: TodoItem[];
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; startDate?: string; finishDate?: string }) => Promise<void>;
  onUpdate: (id: number, data: { title: string; content: string; startDate?: string; finishDate?: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onToggleComplete: (id: number) => Promise<void>;
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finishDate, setFinishDate] = useState<Date | null>(null);

  // Modal hook
  const { modal, showModal, closeModal } = useModal();

  // 팝업이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setEditingTodoId(null);
      setTitle('');
      setContent('');
      setStartDate(null);
      setFinishDate(null);
    }
  }, [isOpen]);

  // 팝업이 열릴 때 선택된 날짜를 기본값으로 설정
  useEffect(() => {
    if (isOpen && selectedDate && !editingTodoId) {
      setStartDate(selectedDate);
      setFinishDate(selectedDate);
    }
  }, [isOpen, selectedDate, editingTodoId]);

  if (!isOpen || !selectedDate) return null;

  const handleTodoClick = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setTitle(todo.text);
    setContent(todo.content || '');
    setStartDate(todo.startDate ? new Date(todo.startDate) : null);
    setFinishDate(todo.finishDate ? new Date(todo.finishDate) : null);
  };

  const handleEditClick = (todo: TodoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    handleTodoClick(todo);
  };

  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
      if (editingTodoId === id) {
        setEditingTodoId(null);
        setTitle('');
        setContent('');
        setStartDate(null);
        setFinishDate(null);
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showModal('제목을 입력해주세요!', 'warning');
      return;
    }

    if (!startDate || !finishDate) {
      showModal('시작일과 종료일을 입력해주세요!', 'warning');
      return;
    }

    if (startDate > finishDate) {
      showModal('시작일은 종료일보다 이전이어야 합니다!', 'warning');
      return;
    }

    const startDateStr = dayjs(startDate).format('YYYY-MM-DD');
    const finishDateStr = dayjs(finishDate).format('YYYY-MM-DD');

    try {
      if (editingTodoId) {
        // 수정 모드
        await onUpdate(editingTodoId, { title, content, startDate: startDateStr, finishDate: finishDateStr });
        setEditingTodoId(null);
      } else {
        // 등록 모드
        await onSubmit({ title, content, startDate: startDateStr, finishDate: finishDateStr });
      }
      
      // 성공 후에만 폼 초기화
      setTitle('');
      setContent('');
      setStartDate(null);
      setFinishDate(null);
    } catch (error) {
      // 에러는 부모 컴포넌트에서 처리하므로 여기서는 무시
      console.error('Form submission error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setTitle('');
    setContent('');
    if (selectedDate) {
      setStartDate(selectedDate);
      setFinishDate(selectedDate);
    }
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
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[600px] max-h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="pt-6 pb-4 px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-main text-2xl font-bold">{formatDate(selectedDate)}</h2>
          <button
            onClick={onClose}
            className="text-main hover:text-gray-200 text-3xl leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-88px)]">
          {/* 할일 목록 */}
          <div className="px-6 py-10 border-b border-gray-200">
            <h3 className="text-lg font-bold text-main mb-4">TODO List</h3>
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
                        ? 'border-2 border-main'
                        : 'hover:bg-gray-100 border-2 border-gray-200'
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
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
                    <div className="flex gap-2 ml-2 text-sm">
                      {!todo.completed && (
                        <Button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            onToggleComplete(todo.id);
                          }}
                          color="bgMain"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          완료
                        </Button>
                      )}
                      {!todo.completed && (
                        <Button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleEditClick(todo, e)}
                          color="bgSub"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          수정
                        </Button>
                      )}
                      <Button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteClick(todo.id, e)}
                        color="bgGray"
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
          <div className="px-6 py-10">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingTodoId ? 'TODO 수정' : 'TODO 추가'}
            </h3>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <Input
                  color="bgray"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="TODO ex) 공부하기, 운동하기, 청소하기"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  내용
                </label>
                <Textarea
                  color="bgray"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="TODO 를 설명해주세요 ex) 영어 공부, 운동 30분, 청소 1시간"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    시작일 <span className="text-red-500">*</span>
                  </label>
                  <InputDatepicker
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    color="bgray"
                    size="md"
                    placeholder="시작일을 선택하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    종료일 <span className="text-red-500">*</span>
                  </label>
                  <InputDatepicker
                    value={finishDate}
                    onChange={(date) => setFinishDate(date)}
                    color="bgray"
                    size="md"
                    placeholder="종료일을 선택하세요"
                  />
                </div>
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

      {/* Confirm Modal */}
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

export default TodoPopup;


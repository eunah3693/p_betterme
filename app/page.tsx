'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import type { TodoItem } from '@/components/Todo';
import TodoCalendar, { type TodoCalendarEvent } from '@/components/Calendars/Calendar';
import TodoPopup from '@/components/Calendars/TodoPopup';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import type { TodoItem as ApiTodoItem } from '@/interfaces/todo';
import { getTodo, createTodo, updateTodo, deleteTodo } from '@/functions/apis/todo';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';

const DATE_FORMAT = 'YYYY-MM-DD';

// 시간은 제외하고 날짜로 파싱
const parseTodoDate = (value?: string | null): Dayjs => {
  if (!value) {
    return dayjs().startOf('day');
  }

  return dayjs(value).startOf('day');
};

export default function Page() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(() => dayjs()); // 현재 보고 있는 달력의 날짜
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 열림 여부
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // 선택된 날짜
  const queryClient = useQueryClient();

  const user = useUserStore((state) => state.user); // 사용자 정보
  const isAuthChecked = useUserStore((state) => state.isAuthChecked); // 서버 인증 확인 완료 여부

  const { modal, showModal, closeModal } = useModal(); // modal hook
  const todosQueryKey = ['todos', user?.id, currentDate.year(), currentDate.month()] as const; // todo 쿼리키
  
  const { 
    data: todos = [], 
    isLoading,
    error,
    refetch 
  } = useQuery<TodoItem[], Error>({
    queryKey: todosQueryKey,
    queryFn: async (): Promise<TodoItem[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const startDateStr = currentDate.startOf('month').format(DATE_FORMAT);
      const endDateStr = currentDate.endOf('month').format(DATE_FORMAT);
      const result = await getTodo({
        memberId: user.id,
        startDate: startDateStr,
        endDate: endDateStr,
      });
      
      if (!result.success || !result.data) {
        throw new Error('Failed to fetch todos');
      }

      return result.data.map((item: ApiTodoItem) => ({
        id: item.idx || 0,
        text: item.subject || '',
        content: item.content || '',
        completed: item.finish === '1',
        date: parseTodoDate(item.startDate).format(DATE_FORMAT),
        startDate: parseTodoDate(item.startDate).format(DATE_FORMAT),
        finishDate: parseTodoDate(item.finishDate).format(DATE_FORMAT),
      }));
    },
    enabled: isAuthChecked && !!user?.id, 
    staleTime: 0,
    gcTime: 0, 
  });

  //쿼리키 무효화
  const invalidateTodos = () => queryClient.invalidateQueries({ queryKey: todosQueryKey });

  //할일추가 mutation
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      await invalidateTodos();
      showModal('할 일이 등록되었습니다!', 'success');
    },
    onError: (error) => {
      console.error('할 일 등록 실패:', error);
      showModal('할 일 등록에 실패했습니다.', 'error');
    },
  });

  //할일수정 mutation
  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: async () => {
      await invalidateTodos();
      showModal('할 일이 수정되었습니다!', 'success');
    },
    onError: (error) => {
      console.error('할 일 수정 실패:', error);
      showModal('할 일 수정에 실패했습니다.', 'error');
    },
  });

  //할일 삭제 mutation
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: async () => {
      await invalidateTodos();
      showModal('할 일이 삭제되었습니다!', 'success');
    },
    onError: (error) => {
      console.error('할 일 삭제 실패:', error);
      showModal('할 일 삭제에 실패했습니다.', 'error');
    },
  });

  //할일 완료 mutation
  const completeTodoMutation = useMutation({
    mutationFn: (id: number) =>
      updateTodo({
        idx: id,
        finish: '1',
      }),
    onSuccess: async () => {
      await invalidateTodos();
      showModal('할 일이 완료되었습니다!', 'success');
    },
    onError: (error) => {
      console.error('할 일 상태 변경 실패:', error);
      showModal('할 일 상태 변경에 실패했습니다.', 'error');
    },
  });


  const calendarEvents: TodoCalendarEvent[] = todos.map((todo: TodoItem) => ({
    id: todo.id,
    start: parseTodoDate(todo.startDate).toDate(),
    end: parseTodoDate(todo.finishDate).toDate(),
    title: todo.text,
    content: todo.content || '',
    completed: todo.completed,
  }));

  // 선택된 날짜의 할일 필터링 (기간 포함)
  const selectedDateTodos = selectedDate 
    ? todos.filter((todo: TodoItem) => {
        const todoStart = parseTodoDate(todo.startDate);
        const todoEnd = parseTodoDate(todo.finishDate);

        return (
          selectedDate.isSame(todoStart, 'day') ||
          selectedDate.isSame(todoEnd, 'day') ||
          (selectedDate.isAfter(todoStart, 'day') && selectedDate.isBefore(todoEnd, 'day'))
        );
      })
    : [];

  // 캘린더에서 이벤트 클릭
  const handleSelectEvent = (event: TodoCalendarEvent) => {
    setSelectedDate(dayjs(event.start));
    setIsPopupOpen(true);
  };

  // 캘린더에서 빈 날짜 클릭
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(dayjs(slotInfo.start));
    setIsPopupOpen(true);
  };

  // 캘린더에서 월 변경 (이전/다음 버튼 클릭)
  const handleNavigate = (date: Date) => {
    setCurrentDate(dayjs(date));
  };

  // 할일 생성
  const handleCreateTodo = async (data: { title: string; content: string; startDate?: string; finishDate?: string }) => {
    if (!selectedDate || !user?.id) return;

    const dateStr = selectedDate.format(DATE_FORMAT);
    await createTodoMutation.mutateAsync({
      memberId: user.id,
      subject: data.title,
      content: data.content,
      finish: '0',
      startDate: data.startDate || dateStr,
      finishDate: data.finishDate || dateStr,
    });
  };

  // 할일 수정
  const handleUpdateTodo = async (id: number, data: { title: string; content: string; startDate?: string; finishDate?: string }) => {
    await updateTodoMutation.mutateAsync({
      idx: id,
      subject: data.title,
      content: data.content,
      startDate: data.startDate,
      finishDate: data.finishDate,
    });
  };

  // 할일 삭제
  const handleDeleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  // 할일 완료
  const handleTodoComplete = async (id: number) => {
    await completeTodoMutation.mutateAsync(id);
  };


  return (
    <>
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1920px] lg:w-[1920px] md:w-[90%] w-[90%]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-main mb-2">
                Todo Calendar
              </h1>
            </div>
            <div className="mb-8">
              <TodoCalendar
                date={currentDate.toDate()}
                events={calendarEvents}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onNavigate={handleNavigate}
                isLoading={isLoading}
                error={error}
                onRetry={refetch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Todo 관리 팝업 */}
      <TodoPopup
        isOpen={isPopupOpen}
        selectedDate={selectedDate}
        todos={selectedDateTodos}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleCreateTodo}
        onUpdate={handleUpdateTodo}
        onDelete={handleDeleteTodo}
        onToggleComplete={handleTodoComplete}
      />

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

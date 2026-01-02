import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import type { TodoItem } from '@/components/Todo';
import TodoCalendar, { type TodoCalendarEvent } from '@/components/Calendars/Calendar';
import TodoPopup from '@/components/Calendars/TodoPopup';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import type { TodoItem as ApiTodoItem } from '@/interfaces/todo';
import { getTodo, createTodo, updateTodo, deleteTodo } from '@/functions/apis/todo';
import { useUserStore } from '@/store/user';
import { useModal } from '@/functions/hooks/useModal';

const Page = () => {
  const currentDate = new Date(); // 현재 날짜 
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 열림 여부
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택된 날짜

  const user = useUserStore((state) => state.user); // 사용자 정보
  const hasHydrated = useUserStore((state) => state._hasHydrated); // 사용자 정보 hydration 완료 여부

  // Modal hook 사용
  const { modal, showModal, closeModal } = useModal();
  
  const { 
    data: todos = [], 
    isLoading,
    error,
    refetch 
  } = useQuery<TodoItem[], Error>({
    queryKey: ['todos', user?.id, currentDate.getFullYear(), currentDate.getMonth()],
    queryFn: async (): Promise<TodoItem[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
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
        date: item.startDate || new Date().toISOString(),
        startDate: item.startDate || new Date().toISOString(),
        finishDate: item.finishDate || new Date().toISOString(),
      }));
    },
    enabled: hasHydrated && !!user?.id, 
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10, 
    retry: 2,
  });


  const calendarEvents: TodoCalendarEvent[] = todos.map((todo: TodoItem) => ({
    id: todo.id,
    start: new Date(todo.startDate || new Date()),
    end: new Date(todo.finishDate || new Date()),
    title: todo.text,
    content: todo.content || '',
    completed: todo.completed,
  }));

  // 선택된 날짜의 할일 필터링 (기간 포함)
  const selectedDateTodos = selectedDate 
    ? todos.filter((todo: TodoItem) => {
        const todoStart = new Date(todo.startDate || new Date());
        const todoEnd = new Date(todo.finishDate || new Date());
        const selected = new Date(selectedDate);
        
        // 선택된 날짜가 Todo의 시작일과 종료일 사이에 있는지 확인
        todoStart.setHours(0, 0, 0, 0);
        todoEnd.setHours(0, 0, 0, 0);
        selected.setHours(0, 0, 0, 0);
        
        return selected >= todoStart && selected <= todoEnd;
      })
    : [];

  // 캘린더에서 이벤트 클릭
  const handleSelectEvent = (event: TodoCalendarEvent) => {
    setSelectedDate(event.start);
    setIsPopupOpen(true);
  };

  // 캘린더에서 빈 날짜 클릭
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.end);
    setIsPopupOpen(true);
  };

  // 할일 생성
  const handleCreateTodo = async (data: { title: string; content: string; startDate?: string; finishDate?: string }) => {
    if (!selectedDate || !user?.id) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    try {
      await createTodo({
        memberId: user.id,
        subject: data.title,
        content: data.content,
        finish: '0',
        startDate: data.startDate || dateStr,
        finishDate: data.finishDate || dateStr,
      });
      
      await refetch();
      showModal('할 일이 등록되었습니다!', 'success');
    } catch (error) {
      console.error('할 일 등록 실패:', error);
      showModal('할 일 등록에 실패했습니다.', 'error');
    }
  };

  // 할일 수정
  const handleUpdateTodo = async (id: number, data: { title: string; content: string; startDate?: string; finishDate?: string }) => {
    try {
      await updateTodo({
        idx: id,
        subject: data.title,
        content: data.content,
        startDate: data.startDate,
        finishDate: data.finishDate,
      });
      
      await refetch();
      showModal('할 일이 수정되었습니다!', 'success');
    } catch (error) {
      console.error('할 일 수정 실패:', error);
      showModal('할 일 수정에 실패했습니다.', 'error');
    }
  };

  // 할일 삭제
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      await refetch();
      showModal('할 일이 삭제되었습니다!', 'success');
    } catch (error) {
      console.error('할 일 삭제 실패:', error);
      showModal('할 일 삭제에 실패했습니다.', 'error');
    }
  };

  // 할일 완료 토글
  const handleToggleComplete = async (id: number) => {
    try {
      await updateTodo({
        idx: id,
        finish: '1',  // 완료 버튼 클릭 시 무조건 1(완료)로 설정
      });
      
      await refetch();
      showModal('할 일이 완료되었습니다!', 'success');
    } catch (error) {
      console.error('할 일 상태 변경 실패:', error);
      showModal('할 일 상태 변경에 실패했습니다.', 'error');
    }
  };


  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1920px] lg:w-[1920px] md:w-[90%] w-[90%]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-main mb-2">Todo Calendar</h1>
            </div>
            <div className="mb-8">
              <TodoCalendar
                events={calendarEvents}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
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
        onToggleComplete={handleToggleComplete}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default Page;
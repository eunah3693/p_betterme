import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';
import type { TodoItem } from '@/components/Todo';
import TodoCalendar, { type TodoCalendarEvent } from '@/components/Calendars/Calendar';
import TodoPopup from '@/components/Calendars/TodoPopup';
import type { TodoItem as ApiTodoItem } from '@/interfaces/todo';
import { getTodo, createTodo, updateTodo, deleteTodo } from '@/functions/apis/todo';
import { getUser } from '@/lib/storage';

const Page = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    
    if (!currentUser) {
      router.push('/login');
    }
  }, [router]);

  
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
        id: item.idx,
        text: item.subject || '',
        content: item.content || '',
        completed: item.finish === '1',
        date: item.startDate || new Date().toISOString(),
        startDate: item.startDate || new Date().toISOString(),
        finishDate: item.finishDate || new Date().toISOString(),
      }));
    },
    enabled: !!user?.id, // user가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10, 
    retry: 2,
  });


  const calendarEvents: TodoCalendarEvent[] = todos.map((todo: any) => ({
    id: todo.id,
    start: new Date(todo.startDate || new Date()),
    end: new Date(todo.finishDate || new Date()),
    title: todo.text,
    content: todo.content || '',
    completed: todo.completed,
  }));

  // 선택된 날짜의 할일 필터링 (기간 포함)
  const selectedDateTodos = selectedDate 
    ? todos.filter((todo: any) => {
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
    setSelectedDate(slotInfo.start);
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
      alert('할 일이 등록되었습니다!');
    } catch (error) {
      console.error('할 일 등록 실패:', error);
      alert('할 일 등록에 실패했습니다.');
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
      alert('할 일이 수정되었습니다!');
    } catch (error) {
      console.error('할 일 수정 실패:', error);
      alert('할 일 수정에 실패했습니다.');
    }
  };

  // 할일 삭제
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      await refetch();
      alert('할 일이 삭제되었습니다!');
    } catch (error) {
      console.error('할 일 삭제 실패:', error);
      alert('할 일 삭제에 실패했습니다.');
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
      alert('할 일이 완료되었습니다!');
    } catch (error) {
      console.error('할 일 상태 변경 실패:', error);
      alert('할 일 상태 변경에 실패했습니다.');
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
              {isLoading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
                    <p className="text-gray-600">Todo 목록을 불러오는 중...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-500 mb-4">데이터를 불러오는데 실패했습니다.</p>
                    <button 
                      onClick={() => refetch()}
                      className="px-6 py-2 bg-main text-white rounded hover:bg-main/90 transition-colors"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              ) : (
                <TodoCalendar
                  events={calendarEvents}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleSelectSlot}
                />
              )}
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
    </div>
  );
};

export default Page;
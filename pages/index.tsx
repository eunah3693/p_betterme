import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import TodoList from '@/components/Todo';
import type { TodoItem } from '@/components/Todo';
import TodoCalendar, { type TodoCalendarEvent } from '@/components/Calendars/Calendar';
import type { TodoItem as ApiTodoItem } from '@/interfaces/todo';
import { getTodo } from '@/functions/apis/todo';

const Page = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { 
    data: todos = [], 
    isLoading,
    error,
    refetch 
  } = useQuery<TodoItem[], Error>({
    queryKey: ['todos', 'test', currentDate.getFullYear(), currentDate.getMonth()],
    queryFn: async (): Promise<TodoItem[]> => {

      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const result = await getTodo({
        memberId: 'test',
        startDate: startDateStr,
        endDate: endDateStr,
      });
      
      if (!result.success || !result.data) {
        throw new Error('Failed to fetch todos');
      }

      return result.data.map((item: ApiTodoItem) => ({
        id: item.idx,
        text: item.subject || '',
        completed: item.finish === 'Y',
        date: item.date || new Date().toISOString(),
      }));
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10, 
    retry: 2,
  });


  const calendarEvents: TodoCalendarEvent[] = todos.map((todo: TodoItem) => ({
    id: todo.id,
    start: new Date(todo.date || new Date()),
    end: new Date(todo.date || new Date()),
    title: todo.text,
    completed: todo.completed,
  }));

  // 캘린더에서 이벤트 클릭
  const handleSelectEvent = (event: TodoCalendarEvent) => {
    const todo = todos.find((t: TodoItem) => t.id === event.id);
    if (todo) {
     
    }
  };


  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1920px] lg:w-[1920px] md:w-[90%] w-[90%]">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-main mb-2">나의 캘린더</h1>
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
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
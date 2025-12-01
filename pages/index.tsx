import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import TodoList from '@/components/Todo';
import type { TodoItem } from '@/components/Todo';
import TodoCalendar, { type TodoCalendarEvent } from '@/components/Calendars/Calendar';
import type { TodoItem as ApiTodoItem } from '@/interfaces/todo';
import { getMonthlyTodo } from '@/functions/apis/todo';

const Page = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);


  const fetchMonthlyTodos = async (date: Date) => {
    try {
      setLoading(true);
      
      // 해당 월의 시작일과 종료일 계산
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // API 호출
      const result = await getMonthlyTodo({
        memberId: 'test',
        startDate: startDateStr,
        endDate: endDateStr,
      });
      
      if (result.success && result.data) {
   
        const convertedTodos: TodoItem[] = result.data.map((item: ApiTodoItem) => ({
          id: item.idx,
          text: item.subject || '',
          completed: item.finish === 'Y',
          date: item.date || new Date().toISOString(),
        }));
        
        setTodos(convertedTodos);
      }
    } catch (error) {
      console.error('Todo 조회 중 오류:', error);
      alert('Todo 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMonthlyTodos(currentDate);
  }, []);


  const calendarEvents: TodoCalendarEvent[] = todos.map((todo) => ({
    id: todo.id,
    start: new Date(todo.date || new Date()),
    end: new Date(todo.date || new Date()),
    title: todo.text,
    completed: todo.completed,
  }));

  // 날짜가 같은지 확인
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // 선택된 날짜의 투두 가져오기
  const getTodosForDate = (date: Date) => {
    return todos.filter(todo => isSameDay(new Date(todo.date || new Date()), date));
  };

  // 캘린더에서 이벤트 클릭
  const handleSelectEvent = (event: TodoCalendarEvent) => {
    const todo = todos.find(t => t.id === event.id);
    if (todo) {
     
    }
  };

  // 캘린더에서 날짜 클릭
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const todosForDate = getTodosForDate(slotInfo.start);
  };


  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      {/* 네브바 */}
      <NavBar />

      {/* 메인 컨텐츠 */}
      <div className="flex justify-center py-8 px-4">
        {/* 캘린더 컨테이너 - PC: 1920px, Mobile: 90% */}
        <div className="w-full max-w-[1920px] lg:w-[1920px] md:w-[90%] w-[90%]">
          {/* 캘린더 카드 */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {/* 캘린더 헤더 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-main mb-2">나의 캘린더</h1>
            </div>

            {/* 캘린더 영역 */}
            <div className="mb-8">
              {loading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
                    <p className="text-gray-600">Todo 목록을 불러오는 중...</p>
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
    </div>
  );
};

export default Page;
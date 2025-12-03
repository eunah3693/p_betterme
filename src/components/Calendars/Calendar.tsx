import React from 'react';
import dynamic from 'next/dynamic';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export interface TodoCalendarEvent {
  id: number;
  start: Date;
  end: Date;
  title: string;
  completed: boolean;
}

interface TodoCalendarProps {
  events: TodoCalendarEvent[];
  onSelectEvent: (evt: TodoCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

const DynamicTodoCalendar = dynamic(
  () => import('react-big-calendar').then(async (mod) => {
    const moment = (await import('moment')).default;
    
    moment.locale('ko', {
      months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
      weekdaysMin: ['일', '월', '화', '수', '목', '금', '토']
    });
    
    const localizer = mod.momentLocalizer(moment);
    
    const TodoCalendarComponent = ({ events, onSelectEvent, onSelectSlot }: TodoCalendarProps) => {
      return React.createElement(mod.Calendar as unknown as React.ComponentType<Record<string, unknown>>, {
        localizer,
        events,
        startAccessor: "start",
        endAccessor: "end",
        style: { height: 600 },
        culture: 'ko',
        view: 'month',
        onView: () => {},
        formats: {
          monthHeaderFormat: 'YYYY년 MMMM',
        },
        messages: {
          month: '월',
          week: '주',
          day: '일',
          previous: '<',
          next: '>',
          allDay: '종일',
          date: '날짜',
          time: '시간',
          event: '할 일',
          noEventsInRange: '해당 기간에 할 일이 없습니다.',
          showMore: (total: number) => `+ ${total}개 더보기`
        },
        onSelectEvent: (evt: TodoCalendarEvent) => {
          onSelectEvent(evt);
        },
        onSelectSlot: (slotInfo: { start: Date; end: Date }) => {
          if (onSelectSlot) {
            onSelectSlot(slotInfo);
          }
        },
        selectable: true,
        eventPropGetter: (event: TodoCalendarEvent) => ({
          style: {
            cursor: 'pointer',
            backgroundColor: event.completed ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            textDecoration: event.completed ? 'line-through' : 'none',
          }
        }),
      });
    };
    
    return { default: TodoCalendarComponent };
  }),
  {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">캘린더 로딩 중...</div>
  }
);

function TodoCalendar({ events, onSelectEvent, onSelectSlot }: TodoCalendarProps) {
  return (
    <div>
      <DynamicTodoCalendar
        events={events}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
      />
    </div>
  );
}

export default TodoCalendar;
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendar.module.css';
import { CalendarSkeleton } from './CalendarSkeleton';
import ErrorMessage from '@/components/Error/ErrorMessage';

export interface TodoCalendarEvent {
  id: number;
  start: Date;
  end: Date;
  title: string;
  completed: boolean;
}

interface TodoCalendarProps {
  date?: Date;
  events: TodoCalendarEvent[];
  onSelectEvent: (evt: TodoCalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onNavigate?: (date: Date) => void;
  isLoading?: boolean; 
  error?: Error | null;
  onRetry?: () => void;
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
    
    const TodoCalendarComponent = ({ date, events, onSelectEvent, onSelectSlot, onNavigate }: TodoCalendarProps) => {
      return React.createElement(mod.Calendar as unknown as React.ComponentType<Record<string, unknown>>, {
        localizer,
        events,
        date: date, 
        startAccessor: "start",
        endAccessor: "end",
        style: { height: 600 },
        culture: 'ko',
        view: 'month',
        onView: () => {},
        onNavigate: (date: Date) => {
          if (onNavigate) {
            onNavigate(date);
          }
        },
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
    loading: () => <CalendarSkeleton />
  }
);

function TodoCalendar({ date, events, onSelectEvent, onSelectSlot, onNavigate, isLoading = false, error = null, onRetry }: TodoCalendarProps) {
  // 에러가 있으면 에러 메시지 표시
  if (error) {
    return <ErrorMessage message="데이터를 불러오는데 실패했습니다." onRetry={onRetry} />;
  }

  // 데이터 로딩 중이면 스켈레톤 표시
  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className={styles.calendar}>
      <DynamicTodoCalendar
        date={date}
        events={events}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onNavigate={onNavigate}
      />
    </div>
  );
}

export default TodoCalendar;
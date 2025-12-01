import { cn } from '@/constants/cn';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendar.module.css';
import { ArtItem } from '@/interfaces/arts';
import { decodeHtmlEntities } from '@/functions/utils/commons';
import { txtVariants } from '@/constants/style';
import arrow_right from '@public/assets/calendar_arrow_right.png';
import popup_close from '@public/assets/popup_close.png';

interface CalendarEvent {
  id: number;
  start: Date;
  end: Date;
  title: string;
  calenderType: number;
}

interface CalendarProps {
  events: CalendarEvent[];
  calendarChange: (range: { startDate: string; endDate: string }) => void;
  onEventClick: (evt: CalendarEvent) => void;
}

const DynamicWeeklyCalendar = dynamic(
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
    
    const WeeklyCalendarComponent = ({ events, calendarChange, onEventClick }: CalendarProps) => {
      return React.createElement(mod.Calendar as unknown as React.ComponentType<Record<string, unknown>>, {
        localizer,
        events,
        startAccessor: "start",
        endAccessor: "end",
        style: { height: 800 },
        culture: 'ko',
        view: 'week',  
        onView: () => {},  
        defaultView: 'week',
        views: ['week'],
        toolbar: true,
        formats: {
          weekdayFormat: (date: Date) => moment(date).format('ddd'),
          dayHeaderFormat: (date: Date) => moment(date).format('M월 D일 (ddd)'),
          timeGutterFormat: 'HH:mm',
          eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
            return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
          },
        },
        messages: {
          month: '월',
          week: '주', 
          day: '일',
          previous: '< 이전 주',
          next: '다음 주 >',
          today: '오늘',
          allDay: '종일',
          date: '날짜',
          time: '시간',
          event: '일정',
          noEventsInRange: '해당 기간에 일정이 없습니다.',
        },
        onNavigate: (date: Date) => {
          calendarChange?.({
            startDate: moment(date).startOf('week').format('YYYY-MM-DD'),
            endDate: moment(date).endOf('week').format('YYYY-MM-DD'),
          });
        },
        onSelectEvent: (evt: CalendarEvent, e: Event) => {
          e?.preventDefault?.();  
          e?.stopPropagation?.(); 
          onEventClick(evt);
        },
        eventPropGetter: () => ({ 
          style: { 
            cursor: 'pointer',
            backgroundColor: '#3b82f6', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 5px',
          } 
        }),
        min: new Date(2024, 0, 1, 0, 0, 0),
        max: new Date(2024, 0, 1, 23, 59, 59),
      });
    };
    
    return { default: WeeklyCalendarComponent };
  }),
  {
    ssr: false,
    loading: () => <div className="h-[800px] flex items-center justify-center">주간 캘린더 로딩 중...</div>
  }
);

function WeeklyCalendar({ arts, calendarChange }: { arts: ArtItem[], calendarChange: (range: { startDate: string; endDate: string }) => void }) {
  const events = arts.map((art, index) => ({
    id: art.id,
    start: new Date(art.startDate),
    end: new Date(art.endDate),
    title: decodeHtmlEntities(art.title),
    calenderType: index,
  }));
  
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEventClick = (evt: CalendarEvent) => {
    setSelectedEvent(evt);
    setPopupOpen(true);
  };

  return (
    <div className={styles.calendar}>
      <DynamicWeeklyCalendar 
        events={events} 
        calendarChange={calendarChange} 
        onEventClick={handleEventClick} 
      />
      
      {popupOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-md w-[90%] max-w-[500px] py-8 px-6">
            <div className="flex justify-between items-center pb-5">
              <h3 className={cn(txtVariants.txt17, 'text-main font-bold')}>
                일정 상세
              </h3>
              <button onClick={() => setPopupOpen(false)} className="px-2 py-1">
                <Image src={popup_close.src} alt="popup_close" width={12} height={12} className='w-3 h-3'/>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">제목</p>
                <p className={cn(txtVariants.txt15, 'text-main font-semibold')}>
                  {selectedEvent.title}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">기간</p>
                <p className={cn(txtVariants.txt14, 'text-main')}>
                  {new Date(selectedEvent.start).toLocaleDateString('ko-KR')} 
                  {' ~ '} 
                  {new Date(selectedEvent.end).toLocaleDateString('ko-KR')}
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button 
                  className="flex-1 bg-main text-white px-4 py-3 rounded hover:bg-main/90 transition-colors flex items-center justify-center gap-2"
                  onClick={() => (window.location.href = `/art/${selectedEvent.id}`)}
                >
                  <span>상세보기</span>
                  <Image src={arrow_right.src} alt="arrow_right" width={12} height={20} className='w-3 h-5'/>
                </button>
                <button 
                  className="px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => setPopupOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyCalendar;
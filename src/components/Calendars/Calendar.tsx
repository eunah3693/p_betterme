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
  onEventClick: (evt: CalendarEvent | { start: Date; events: CalendarEvent[] }) => void;
}

interface EventClickData {
  start: Date;
  events?: CalendarEvent[];
}

const DynamicCalendar = dynamic(
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
    
    const CalendarComponent = ({ events, calendarChange, onEventClick }: CalendarProps) => {
      return React.createElement(mod.Calendar as unknown as React.ComponentType<Record<string, unknown>>, {
        localizer,
        events,
        startAccessor: "start",
        endAccessor: "end",
        style: { height: 1000 },
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
          event: '일정',
          noEventsInRange: '해당 기간에 일정이 없습니다.',
          showMore: (total: number) => `+ ${total}개 더보기`
        },
        onNavigate: (date: Date) => {
          calendarChange?.({
            startDate: moment(date).startOf('month').format('YYYY-MM-DD'),
            endDate: moment(date).endOf('month').format('YYYY-MM-DD'),
          });
        },
        onSelectEvent: (evt: CalendarEvent, e: Event) => {
          e?.preventDefault?.();  
          e?.stopPropagation?.(); 
          window.location.href = `/art/${evt.id}`;
        },
        onShowMore: (events: CalendarEvent[], date: Date) => {
          if (onEventClick) {
            onEventClick({ start: date, events });
          }
        },
        eventPropGetter: () => ({ style: { cursor: 'pointer',backgroundColor: '#f5f5f5', } }),
      });
    };
    
    return { default: CalendarComponent };
  }),
  {
    ssr: false,
    loading: () => <div className="h-[500px] flex items-center justify-center">캘린더 로딩 중...</div>
  }
);

function ArtCalendar({ arts, calendarChange }: { arts: ArtItem[], calendarChange: (range: { startDate: string; endDate: string }) => void }) {
  const events = arts.map((art, index) => ({
    id: art.id,
    start: new Date(art.startDate),
    end: new Date(art.endDate),
    title: decodeHtmlEntities(art.title),
    calenderType: index,
  }));
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<typeof events>([]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleEventClick = (evt: CalendarEvent | EventClickData) => {
    let day: Date;
    let matches: CalendarEvent[] = [];
    
    if ('events' in evt && evt.events && Array.isArray(evt.events)) {
      day = evt.start ? new Date(evt.start) : new Date();
      matches = evt.events.map((e) => ({
        id: e.id,
        start: e.start,
        end: e.end,
        title: e.title,
        calenderType: e.calenderType,
      }));
    } else {
      day = evt.start ? new Date(evt.start) : new Date();
      matches = events.filter((e) => isSameDay(new Date(e.start), day));
    }
    setSelectedDate(day);
    setDayEvents(matches);
    setPopupOpen(true);
  };

  return (
    <div className={styles.calendar}>
      <DynamicCalendar events={events} calendarChange={calendarChange} onEventClick={handleEventClick} />
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-md w-[90%] max-w-[600px] py-8 px-5">
            <div className="flex justify-between items-center pl-1 pb-5">
              <h3 className={cn(txtVariants.txt17, 'text-main font-bold')}>
                {selectedDate?.toLocaleDateString('ko-KR')}
              </h3>
              <button onClick={() => setPopupOpen(false)} className="px-2 py-1">
                <Image src={popup_close.src} alt="popup_close" width={12} height={12} className='w-3 h-3'/>
              </button>
            </div>
            <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {dayEvents.map((e) => (
                <li key={e.id} className="border p-4 rounded flex justify-between items-center">
                  <span className={cn(txtVariants.txt15, 'text-main')}>{e.title}</span>
                  <button className="text-blue-600" onClick={() => (window.location.href = `/art/${e.id}`)}>
                    <Image src={arrow_right.src} alt="arrow_right" width={12} height={20} className='w-3 h-5'/>
                  </button>
                </li>
              ))}
              {dayEvents.length === 0 && <li className="text-gray-500">이 날짜의 일정이 없습니다.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtCalendar;
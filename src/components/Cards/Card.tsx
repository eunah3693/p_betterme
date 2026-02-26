'use client';

import type { DiaryItem } from '@/interfaces/diary';
import type { BlogItem } from '@/interfaces/blog';

interface CardProps {
  data: DiaryItem | BlogItem;
  onClick?: () => void;
  className?: string;
}

function Card({ data, onClick, className }: CardProps) {
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const getTruncatedContent = (content: string) => {
    const text = stripHtml(content);
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const first3Lines = lines.slice(0, 3).join('\n');
    
    if (lines.length > 3) {
      return first3Lines + '...';
    }
    return first3Lines;
  };


  return (
    <div
      onClick={onClick}
      className={`w-full bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden ${className || ''}`}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-main mb-4 truncate">
          {data.subject || '제목 없음'}
        </h2>
        <hr className="mb-4 border-gray-200" />
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line line-clamp-3">
          {getTruncatedContent(data.content || '')}
        </p>
      </div>
    </div>
  );
}

export default Card;

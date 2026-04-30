'use client';
import Link from 'next/link';
import type { DiaryItem } from '@/interfaces/diary';
import type { BlogItem } from '@/interfaces/blog';

interface CardProps {
  data: DiaryItem | BlogItem;
  className?: string;
  url?:string;
}

function Card({ data, className, url }: CardProps) {
  const decodeHtmlEntities = (value: string) => {
    return value
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&amp;/g, '&');
  };

  const stripHtml = (html: string) => {
    return decodeHtmlEntities(html).replace(/<[^>]*>/g, '').trim();
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
    <Link href={url||'/'}
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
    </Link>
  );
}

export default Card;

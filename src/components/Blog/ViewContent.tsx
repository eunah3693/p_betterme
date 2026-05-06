'use client';

import { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';
import { cn } from '@/constants/cn';
import { DiaryItem } from '@/interfaces/diary'; 
import { BlogItem } from '@/interfaces/blog';


interface BlogViewProps {
  data: DiaryItem | BlogItem;
}

function BlogView({
  data,
}: BlogViewProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    setSanitizedContent(createDOMPurify(window).sanitize(data?.content || ''));
  }, [data?.content]);
  
  return (
    <article className={cn('bg-white rounded-lg shadow-sm')}>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-main mb-6 break-words">
          {data?.subject}
        </h1>
        <hr className="my-6 border-gray-200" />
        <div className="tiptap"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </article>
  );
}

export default BlogView;

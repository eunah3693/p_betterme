import { cn } from '@/constants/cn';
import Image from 'next/image';
import Badge from '@/components/Forms/Badge';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  date?: string;
  category?: string;
  thumbnail?: string;
  tags?: string[];
  className?: string;
}

function BlogPost({
  title,
  content,
  author = '관리자',
  date,
  category,
  thumbnail,
  tags = [],
  className
}: BlogPostProps) {
  const formattedDate = date 
    ? new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className={cn('bg-white rounded-lg shadow-sm', className)}>
      {/* 썸네일 이미지 */}
      {thumbnail && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-t-lg">
          <Image 
            src={thumbnail} 
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 본문 내용 */}
      <div className="p-6 md:p-8">
        {/* 카테고리 & 날짜 */}
        <div className="flex items-center gap-3 mb-4">
          {category && (
            <Badge color="bMain" size="sm" variant="light">
              {category}
            </Badge>
          )}
          {formattedDate && (
            <span className="text-sm text-gray-500">{formattedDate}</span>
          )}
        </div>

        {/* 제목 */}
        <h1 className="text-2xl md:text-4xl font-bold text-main mb-4 break-words">
          {title}
        </h1>

        {/* 작성자 */}
        {author && (
          <div className="flex items-center gap-2 mb-6 text-gray-600">
            <span className="text-sm">작성자:</span>
            <span className="text-sm font-medium">{author}</span>
          </div>
        )}

        {/* 구분선 */}
        <hr className="my-6 border-gray-200" />

        {/* 본문 내용 */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* 태그 */}
        {tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  color="bInfo" 
                  size="sm"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default BlogPost;

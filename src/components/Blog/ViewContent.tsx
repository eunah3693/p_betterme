import { cn } from '@/constants/cn';
import { useRouter } from 'next/router';
import { DiaryItem } from '@/interfaces/diary'; 
import { BlogItem } from '@/interfaces/blog';
import Button from '../Buttons/Button';

interface BlogViewProps {
  data: DiaryItem | BlogItem;
  type?: 'blog' | 'diary';  // ⭐ 타입 추가
}

function BlogView({
  data,
  type = 'diary'  // ⭐ 기본값은 diary (기존 동작 유지)
}: BlogViewProps) {
  const router = useRouter();
  
  // ⭐ 타입에 따라 URL 결정
  const baseUrl = type === 'blog' ? '/blog' : '/diary';
  
  return (
    <article className={cn('bg-white rounded-lg shadow-sm')}>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-main mb-6 break-words flex justify-between items-end">
          {data?.subject}
          {data?.date && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 font-normal">
                작성일: {new Date(data?.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </h1>
        <hr className="my-6 border-gray-200" />
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: data?.content || '' }}
        />
        {data?.isAuthor && (
        <div className="flex gap-3 justify-end pt-4">
            <Button
              size="sm"
              color="bMain"
              onClick={() => window.history.back()}
            >
              목록
            </Button>
            <Button
              size="sm"
              color="bgMain"
              onClick={() => router.push(`${baseUrl}/${data.idx}/update`)}
            >
              수정
            </Button>
            <Button
              size="sm"
              color="bgDanger"
              onClick={() => router.push(`${baseUrl}/${data.idx}/delete`)}
            >
                삭제
              </Button>
            </div>
          )}
      </div>
    </article>
  );
}

export default BlogView;

import { cn } from '@/constants/cn';
import { DiaryItem } from '@/interfaces/diary'; 
import { BlogItem } from '@/interfaces/blog';


interface BlogViewProps {
  data: DiaryItem | BlogItem;
}

function BlogView({
  data,
}: BlogViewProps) {
  
  return (
    <article className={cn('bg-white rounded-lg shadow-sm')}>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-main mb-6 break-words flex justify-between items-end">
          {data?.subject}
          {/* {data?.date && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 font-normal">
                작성일: {new Date(data?.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )} */}
        </h1>
        <hr className="my-6 border-gray-200" />
        <div 
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: data?.content || '' }}
        />
      </div>
    </article>
  );
}

export default BlogView;

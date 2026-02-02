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
        <h1 className="text-2xl md:text-4xl font-bold text-main mb-6 break-words">
          {data?.subject}
        </h1>
        <hr className="my-6 border-gray-200" />
        <div className="tiptap"
          dangerouslySetInnerHTML={{ __html: data?.content || '' }}
        />
      </div>
    </article>
  );
}

export default BlogView;

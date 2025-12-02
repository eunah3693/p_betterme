import { cn } from '@/constants/cn';

interface BlogViewProps {
  title: string;
  content: string;
  className?: string;
}

function BlogView({
  title,
  content,
  className
}: BlogViewProps) {
  return (
    <article className={cn('bg-white rounded-lg shadow-sm', className)}>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-main mb-6 break-words">
          {title}
        </h1>
        <hr className="my-6 border-gray-200" />
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}

export default BlogView;

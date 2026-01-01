import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import NavBar from '@/components/NavBar';
import BlogView from '@/components/Blog/ViewContent';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import { getBlogByIdx, deleteBlog } from '@/functions/apis/blog';
import type { BlogItem } from '@/interfaces/blog';
import Button from '@/components/Buttons/Button';

const BlogDetailPage = () => {
  const router = useRouter();
  const { idx } = router.query;
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: blogData,
    isLoading,
    error,
    refetch
  } = useQuery<BlogItem | null, Error>({
    queryKey: ['blog', idx],
    queryFn: async (): Promise<BlogItem | null> => {
      if (!idx) return null;

      const result = await getBlogByIdx(Number(idx));

      if (!result.success || !result.data) {
        return null;
      }

      if (Array.isArray(result.data)) {
        return result.data[0] || null;
      }

      return result.data as BlogItem;
    },
    enabled: !!idx, 
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10, 
    retry: 2,
  });

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!idx) return;

    try {
      setIsDeleting(true);
      const result = await deleteBlog(Number(idx));

      if (result.success) {
        alert('블로그가 삭제되었습니다.');
        router.push('/blog');
      } else {
        alert(result.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('블로그 삭제 중 오류:', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <NavBar />
      
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          {error || !blogData ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : (
            <>
              <BlogView 
                data={blogData}
              />
              {blogData?.isAuthor && (
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
                    onClick={() => router.push(`/blog/${blogData.idx}/update`)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    color="bgDanger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;


import React from 'react';
import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import Card from '@/components/Cards/Card';
import { getMonthlyBlogs, getRecommendedBlogs, getMostViewedBlogs } from '@/functions/apis/blog';
import type { BlogItem, BlogListResponse } from '@/interfaces/blog';

// type에 따른 blog 조회
const getBlogList = async (type: string, page: number): Promise<BlogListResponse> => {
  if (type === 'monthly') {
    return getMonthlyBlogs({ page : page });
  } else if (type === 'recommended') {
    return getRecommendedBlogs({ page : page });
  } else if (type === 'mostviewed') {
    return getMostViewedBlogs({ page : page });
  }
  
  return getMonthlyBlogs({ page });
};

const BlogListPage = () => {
  const router = useRouter();
  const { type } = router.query; // monthly, recommended, mostviewed, tag 
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data : blogListData,
    isLoading : isBlogsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BlogListResponse>({
    queryKey: ["blogList", type],
    queryFn: ({ pageParam = 0 }) => getBlogList(type as string, pageParam as number),
    getNextPageParam: (lastPage) => {
      if (!lastPage.page) return undefined;
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!type,
  });

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('fetchNextPage');
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 } 
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const blogs = blogListData?.pages.flatMap(page => page.data) || [];


  const handleCardClick = (idx: number) => {
    router.push(`/blog/${idx}`);
  };

  return (
    <div className="font-notoSans min-h-screen bg-gray-50">
      <LoadingOverlay isLoading={isBlogsLoading} message="블로그를 불러오는 중" />
      <NavBar />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">블로그</h1>
              <p className="text-gray-600">다양한 이야기를 공유합니다</p>
            </div>
          </div>
            <div>
                <div className="py-5 pb-5">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-main mb-2">
                      {type === 'monthly' && '이달의 블로그'}
                      {type === 'recommended' && '추천 블로그'}
                      {type === 'mostviewed' && '많이 본 블로그'}
                    </h1>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog: BlogItem) => (
                    <Card
                      key={blog.idx}
                      data={blog}
                      onClick={() => handleCardClick(blog.idx)}
                    />
                  ))}
                </div>
                {isFetchingNextPage && (
                  <div className="py-20 text-center text-gray-500">불러오는 중...</div>
                )}
                <div ref={loaderRef} className="h-8" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;


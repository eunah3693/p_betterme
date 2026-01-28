import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Button from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import ErrorMessage from '@/components/Error/ErrorMessage';
import NoContent from '@/components/Empty/NoContent';
import Card from '@/components/Cards/Card';
import CategoryList from '@/components/Blog/CategoryList';
import { getMyBlogs, getCategories } from '@/functions/apis/blog';
import type { BlogItem, BlogListResponse } from '@/interfaces/blog';

const BlogListPage = () => {
  const router = useRouter();
  const { id, category } = router.query;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // URL에서 category 파라미터가 있으면 초기 선택 상태 설정
  useEffect(() => {
    if (category) {
      setSelectedCategory(Number(category));
    }
  }, [category]);

  // 카테고리 목록 조회
  const { data: categoryData } = useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategories(id as string),
    enabled: !!id,
  });

  const categories = categoryData?.data || [];

  const {
    data: blogListData,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<BlogListResponse>({
    queryKey: ['myblog', id, selectedCategory],
    queryFn: ({ pageParam = 0 }) => getMyBlogs({ 
      page: pageParam as number,
      categoryIdx: selectedCategory
    }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.page) return undefined;
      const { number, totalPages } = lastPage.page;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });

  // 무한스크롤 감지
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const blogList = blogListData?.pages.flatMap(page => page.data) || [];

  const handleCardClick = (idx: number) => {
    router.push(`/blog/${idx}`);
  };

  const handleCategoryClick = (categoryIdx: number | null) => {
    setSelectedCategory(categoryIdx);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="블로그를 불러오는 중" />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">

          <div className="mb-8 md:flex justify-between items-end pt-10 md:pt-0">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-main mb-2"> {id}님의 블로그</h1>
              <p className="text-gray-600">다양한 이야기를 공유합니다</p>
            </div>
            <div className="flex justify-end ">
              <Button
                onClick={() => router.push('/blog/register')}
                color="bgMain"
                size="md"
                className="hover:bg-main/90 transition-colors whitespace-nowrap mr-2"
              >
                글쓰기
              </Button>
              <Button
                onClick={() => router.push('/blog/category')}
                color="bgMain"
                size="md"
                className="hover:bg-main/90 transition-colors whitespace-nowrap"
              >
                카테고리 관리
              </Button>
            </div>
          </div>

          {error ? (
            <ErrorMessage onRetry={() => refetch()} />
          ) : blogList.length === 0 && !isLoading ? (
            <NoContent message="등록된 블로그가 없습니다." />
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* 카테고리 사이드바 */}
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryClick={handleCategoryClick}
              />
              {/* 블로그 목록 */}
              <div className="w-full md:w-[70%]">
                <div className="w-full flex flex-col gap-6">
                  {blogList.map((blog: BlogItem) => (
                    <Card
                      key={blog.idx}
                      data={blog}
                      onClick={() => handleCardClick(blog.idx)}
                    />
                  ))}
                </div>
                
                {/* 무한스크롤 로딩 표시 */}
                {isFetchingNextPage && (
                  <div className="py-20 text-center text-gray-500">불러오는 중...</div>
                )}
                
                {/* 무한스크롤 감지 영역 */}
                <div ref={loaderRef} className="h-8" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogListPage;


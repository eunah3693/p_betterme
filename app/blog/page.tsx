'use client';
import React from 'react';
import { useUserStore } from '@/store/user';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Button from '@/components/Buttons/Button';
import LoadingOverlay from '@/components/Loading/LoadingOverlay';
import Card from '@/components/Cards/Card';
import { getMonthlyBlogs, getRecommendedBlogs, getMostViewedBlogs } from '@/functions/apis/blog';
import type { BlogItem, BlogListResponse } from '@/interfaces/blog';
import moreIcon from '@assets/more.svg';

export default function BlogListPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: monthlyBlogsData, isLoading: isMonthlyBlogsLoading } = useQuery<BlogListResponse>({
    queryKey: ["blogs","monthly"],
    queryFn: () => getMonthlyBlogs({ page: 0 }),
    staleTime: 0
  });
  const { data: recommendedBlogsData, isLoading: isRecommendedBlogsLoading } = useQuery<BlogListResponse>({
    queryKey: ["blogs","recommended"],
    queryFn: () => getRecommendedBlogs({ page: 0 }),
    staleTime: 0
  });
  const { data: mostViewedBlogsData, isLoading: isMostViewedBlogsLoading } = useQuery<BlogListResponse>({
    queryKey: ["blogs","mostViewed"],
    queryFn: () => getMostViewedBlogs({ page: 0 }),
    staleTime: 0
  });

  const monthlyBlogs = monthlyBlogsData?.data || [];
  const recommendedBlogs = recommendedBlogsData?.data || [];
  const mostViewedBlogs = mostViewedBlogsData?.data || [];


  const handleCardClick = (idx: number) => {
    router.push(`/blog/${idx}`);
  };

  return (
    <>
      <LoadingOverlay isLoading={isMonthlyBlogsLoading || isRecommendedBlogsLoading || isMostViewedBlogsLoading} message="블로그를 불러오는 중" />
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-main mb-2">블로그</h1>
              <p className="text-gray-600">다양한 이야기를 공유합니다</p>
            </div>
            {user && (
              <Button
                onClick={() => router.push(`/blog/myblog?id=${user?.id}`)}
                color="bgMain"
                size="md"
                className="hover:bg-main/90 transition-colors whitespace-nowrap"
              >
                내 블로그
              </Button>
            )}
          </div>
            <div>
                <div className="py-5 pb-5">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-main mb-2">이달의 블로그</h1>
                    <Link href="/blog/list?type=monthly"><Image src={moreIcon} alt="더보기" width={50} /></Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monthlyBlogs.map((blog: BlogItem) => (
                    <Card
                      key={blog.idx}
                      data={blog}
                      onClick={() => handleCardClick(blog.idx)}
                    />
                  ))}
                </div>
                <div className="py-10 pb-5">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-main mb-2">추천 블로그</h1>
                    <Link href="/blog/list?type=recommended"><Image src={moreIcon} alt="더보기" width={50} /></Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedBlogs.map((blog: BlogItem) => (
                    <Card
                      key={blog.idx}
                      data={blog}
                      onClick={() => handleCardClick(blog.idx)}
                    />
                  ))}
                </div>
                <div className="py-10 pb-5">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-main mb-2">많이 본 블로그</h1>
                    <Link href="/blog/list?type=mostviewed"><Image src={moreIcon} alt="더보기" width={50} /></Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mostViewedBlogs.map((blog: BlogItem) => (
                    <Card
                      key={blog.idx}
                      data={blog}
                      onClick={() => handleCardClick(blog.idx)}
                    />
                  ))}
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

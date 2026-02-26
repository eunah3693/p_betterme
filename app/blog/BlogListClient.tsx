'use client';
import React from 'react';
import { useUserStore } from '@/store/user';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/Buttons/Button';
import Card from '@/components/Cards/Card';
import type { BlogItem, BlogListResponse } from '@/interfaces/blog';
import moreIcon from '@assets/more.svg';
import { useQuery } from '@tanstack/react-query';
import { fetchMonthlyBlogs, fetchRecommendedBlogs, fetchMostViewedBlogs } from '@/functions/apis/blog';

export default function BlogListClient() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const { data: monthlyData, refetch: refetchMonthly } = useQuery<BlogListResponse>({
    queryKey: ['blogs', 'monthly', 0],
    queryFn: () => fetchMonthlyBlogs(0),
  });

  const { data: recommendedData, refetch: refetchRecommended } = useQuery<BlogListResponse>({
    queryKey: ['blogs', 'recommended', 0],
    queryFn: () => fetchRecommendedBlogs(0),
  });

  const { data: mostViewedData, refetch: refetchMostViewed } = useQuery<BlogListResponse>({
    queryKey: ['blogs', 'mostviewed', 0],
    queryFn: () => fetchMostViewedBlogs(0),
  });

  const monthlyBlogs = monthlyData?.data || [];
  const recommendedBlogs = recommendedData?.data || [];
  const mostViewedBlogs = mostViewedData?.data || [];

  const handleCardClick = (idx: number) => {
    router.push(`/blog/${idx}`);
  };

  const handleRefreshAll = () => {
    refetchMonthly();
    refetchRecommended();
    refetchMostViewed();
  };

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-[1200px] lg:w-[1200px] md:w-[90%] w-[90%]">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-main mb-2">블로그</h1>
            <p className="text-gray-600">다양한 이야기를 공유합니다</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefreshAll}
              color="bgMain"
              size="md"
              className="hover:bg-main/90 transition-colors whitespace-nowrap"
            >
              새로고침
            </Button>
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
        </div>
        
        <div>
          {/* 이달의 블로그 섹션 */}
          <div className="py-5 pb-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-main mb-2">이달의 블로그</h1>
              <Link href="/blog/list?type=monthly">
                <Image src={moreIcon} alt="더보기" width={50} />
              </Link>
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

          {/* 추천 블로그 섹션 */}
          <div className="py-10 pb-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-main mb-2">추천 블로그</h1>
              <Link href="/blog/list?type=recommended">
                <Image src={moreIcon} alt="더보기" width={50} />
              </Link>
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

          {/* 많이 본 블로그 섹션 */}
          <div className="py-10 pb-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-main mb-2">많이 본 블로그</h1>
              <Link href="/blog/list?type=mostviewed">
                <Image src={moreIcon} alt="더보기" width={50} />
              </Link>
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
  );
}

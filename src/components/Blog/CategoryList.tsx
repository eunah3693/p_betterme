'use client';

import React, { use, useEffect, useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogCategoryItem } from '@/interfaces/blog';
import hanburgerIcon from '@assets/hamburger.svg';

interface CategoryListProps {
  categories: BlogCategoryItem[];
  id:string;
  selectedCategory: number | null;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  id,
  selectedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const panelId = useId();

  // 모바일 드롭다운 닫기
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        setIsOpen(false);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (categories.length === 0) return null;

  const baseItemClass =
    'w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors block';

  const getItemClass = (active: boolean) =>
    `${baseItemClass} ${active ? 'bg-main text-white font-semibold' : 'hover:bg-gray-100 text-gray-700'}`;


  return (
    <div className="w-full md:w-[30%] md:flex-shrink-0">
      <div className="md:hidden">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((v) => !v)}
          className={`fixed ${isScrolled ? 'top-[10px]' : 'top-20'} right-4 z-0 flex items-center gap-2 rounded-full bg-white border border-main border-[2px] text-main shadow-lg px-4 py-2`}
        >
          {/* 햄버거 아이콘 */}
          <span className="inline-flex flex-col justify-center gap-1">
            <Image src={hanburgerIcon} alt="hanburger" width={20} height={20} />
          </span>
          <span className="text-sm font-semibold">카테고리</span>
        </button>

        {isOpen && (
          <>
            <button
              type="button"
              aria-label="카테고리 닫기"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/20"
            />
            <div
              id={panelId}
              className="fixed top-32 left-4 right-4 z-50 bg-white rounded-lg shadow-md p-4 max-h-[60vh] overflow-auto"
            >
              <Link
                href={'/blog/myblog?id=' + id}
                className={getItemClass(selectedCategory === null)}
                onClick={() => setIsOpen(false)}
              >
                전체 보기
              </Link>
              {categories.map((category: BlogCategoryItem) => (
                <Link
                  href={'/blog/myblog?id=' + id + '&category=' + category.idx}
                  key={category.idx}
                  className={getItemClass(selectedCategory === category.idx)}
                  onClick={() => setIsOpen(false)}
                >
                  {category.categoryName}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="hidden md:block md:sticky md:top-7 bg-white rounded-lg shadow-md p-4">
        <Link
          href={'/blog/myblog?id=' + id}
          className={getItemClass(selectedCategory === null)}
        >
          전체 보기
        </Link>

        {categories.map((category: BlogCategoryItem) => (
          <Link
            href={
              '/blog/myblog?id=' +
              category.memberId +
              '&category=' +
              category.idx
            }
            key={category.idx}
            className={getItemClass(selectedCategory === category.idx)}
          >
            {category.categoryName}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

import Link from 'next/link';
import { paths } from '@/constants/paths';

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold text-main md:text-4xl">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          주소가 잘못 입력되었거나, 요청하신 페이지가 이동 또는 삭제되었을 수 있습니다.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={paths.CALENDAR}
            className="rounded-sm bg-main px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-main/90"
          >
            홈으로 이동
          </Link>
          <Link
            href={paths.BLOG}
            className="rounded-sm border border-main bg-white px-6 py-3 text-sm font-semibold text-main transition-colors hover:bg-gray-50"
          >
            블로그 보기
          </Link>
        </div>
      </section>
    </main>
  );
}

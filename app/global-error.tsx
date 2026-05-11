'use client';

import Link from 'next/link';
import { paths } from '@/constants/paths';
import '@/styles/global.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
          <section className="w-full max-w-xl text-center">
            <h1 className="text-2xl font-bold text-main md:text-4xl">
              일시적인 오류가 발생했습니다.
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>
            {error.digest && (
              <p className="mt-3 text-sm text-gray-400">
                오류 코드: {error.digest}
              </p>
            )}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="rounded-sm bg-main px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-main/90"
              >
                다시 시도
              </button>
              <Link
                href={paths.CALENDAR}
                className="rounded-sm border border-main bg-white px-6 py-3 text-sm font-semibold text-main transition-colors hover:bg-gray-50"
              >
                홈으로 이동
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}

import { CardSkeleton } from '@/components/Cards/CardSkeleton';

export default function Loading() {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-[90%] max-w-[1200px] md:w-[90%] lg:w-[1200px]">
        <div className="mb-8 pt-10 md:flex md:items-end md:justify-between md:pt-0">
          <div className="mb-4 md:mb-0">
            <div className="mb-2 h-9 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-52 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex justify-end gap-2">
            <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="hidden md:block md:w-[30%] md:flex-shrink-0">
            <div className="rounded-lg bg-white p-4 shadow-md">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="mb-2 h-10 w-full animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          </aside>

          <div className="w-full md:w-[70%]">
            <div className="flex w-full flex-col gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

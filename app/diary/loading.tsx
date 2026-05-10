import { CardSkeletonGrid } from '@/components/Cards/CardSkeleton';

export default function Loading() {
  return (
    <div className="flex justify-center px-4 py-10 md:py-15">
      <div className="w-[90%] max-w-[1200px] md:w-[90%] lg:w-[1200px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 h-9 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-72 max-w-full animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-10 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        <CardSkeletonGrid count={12} />
      </div>
    </div>
  );
}

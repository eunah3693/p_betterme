import { CardSkeletonGrid } from '@/components/Cards/CardSkeleton';

export default function Loading() {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-[90%] max-w-[1200px] md:w-[90%] lg:w-[1200px]">
        <div className="mb-8 pt-10 md:flex md:items-end md:justify-between md:pt-0">
          <div className="mb-4 md:mb-0">
            <div className="mb-2 h-9 w-44 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="w-full">
          <CardSkeletonGrid count={12} />
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

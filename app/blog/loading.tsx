import { CardSkeletonGrid } from '@/components/Cards/CardSkeleton';

export default function Loading() {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-[90%] max-w-[1200px] md:w-[90%] lg:w-[1200px]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 h-9 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <section>
          <div className="py-5 pb-5">
            <div className="h-7 w-36 animate-pulse rounded bg-gray-200" />
          </div>
          <CardSkeletonGrid count={3} />
        </section>

        <section>
          <div className="py-10 pb-5">
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <CardSkeletonGrid count={3} />
        </section>

        <section>
          <div className="py-10 pb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <CardSkeletonGrid count={3} />
        </section>
      </div>
    </div>
  );
}

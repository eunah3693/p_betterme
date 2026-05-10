interface CardSkeletonGridProps {
  count?: number;
}

export function CardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-6">
        <div className="mb-4 h-7 w-3/4 animate-pulse rounded bg-gray-200" />
        <hr className="mb-4 border-gray-200" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: CardSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

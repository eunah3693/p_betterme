import CardSkeleton from '@/components/Cards/CardSkeleton';


function CardFullListSkeleton() {
  return (
    <div className={"grid gap-[10px] grid-cols-2 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2"}>
        {Array.from({ length: 10}).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
    </div>
  );
}

export default CardFullListSkeleton;
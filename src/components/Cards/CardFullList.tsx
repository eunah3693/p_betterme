import Card from '@/components/Cards/Card';
import { artKorean } from '@/constants/strings';
import { decodeHtmlEntities } from '@/functions/utils/commons';
import { ArtItem } from '@/interfaces/arts';
import test_img from '@public/assets/test_img.png';
import CardSkeleton from './CardSkeleton';

type CardListProps = {
  data: ArtItem[];
  isLoading?: boolean;
};

function CardFullList({ data, isLoading }: CardListProps) {
  const grid = "grid gap-[10px] grid-cols-2 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2";

  return (
    <div className={grid}>
      {isLoading ? (
        <>
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </>
      ) : (
        <>
          {data.map((item, index) => (
            <Card 
              data={{
                image: item.thumbnail || test_img,
                title: decodeHtmlEntities(item.title || `전시회`),
                category: artKorean[item.artType as keyof typeof artKorean] || '공연전시',
                description: `${item.startDate} ~ ${item.endDate}`,
                url: `/art/${item.id}`
              }}
              key={index} 
              size='md' 
              titleSize='lg' 
              descriptionSize='sm' 
              titleColor='main' 
              descriptionColor='info'
            />
          ))}
        </>
      )}
    </div>
  );
}

export default CardFullList;
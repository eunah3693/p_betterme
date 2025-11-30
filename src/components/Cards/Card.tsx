import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/constants/cn';
import { useState } from 'react';
import Image from 'next/image';
import { txtVariants } from '@/constants/style';
import { StaticImageData } from 'next/image';


export const CardVariants = cva(
  '',
  {
    variants: {
      size: {
        default: '',
        sm: 'w-full bg-white rounded-sm shadow-sm',
        md: 'w-full bg-white rounded-md shadow-md',
        lg: 'w-full bg-white rounded-lg shadow-lg',
        xl: 'w-full bg-white rounded-xl shadow-xl',
      },
      titleSize: {
        default: '',
        sm: txtVariants.txt14,
        md: txtVariants.txt16,
        lg: txtVariants.txt18,
        xl: txtVariants.txt20,
      },
      descriptionSize: {
        default: '',
        sm: txtVariants.txt14,
        md: txtVariants.txt16,
        lg: txtVariants.txt18,
        xl: txtVariants.txt20,
      },
      titleColor: {
        default: 'text-main',
        main: 'text-main',
        sub: 'text-sub',
        info: 'text-info',
        caution: 'text-caution',
        highlight: 'text-highlight',
      },
      descriptionColor: {
        default: 'text-gray-700',
        main: 'text-main',
        sub: 'text-sub',
        info: 'text-info',
        caution: 'text-caution',
        highlight: 'text-highlight',
      },
    },
    defaultVariants: {
      size: 'default',
      titleSize: 'default',
      descriptionSize: 'default',
      titleColor: 'default',
      descriptionColor: 'default',
    },
  }
);


interface cardData {
  image: string | StaticImageData;
  title: string;
  category: string;
  description: string;
  url: string;
}

interface CardProps extends VariantProps<typeof CardVariants> {
  className?: string;
  data: cardData;
  size?: 'default' | 'sm' | 'md' | 'lg' | 'xl' ;
  titleSize?: 'default' | 'sm' | 'md' | 'lg' | 'xl';
  descriptionSize?: 'default' | 'sm' | 'md' | 'lg' | 'xl';
  titleColor?: 'default' | 'main' | 'sub' | 'info' | 'caution' | 'highlight';
  descriptionColor?: 'default' | 'main' | 'sub' | 'info' | 'caution' | 'highlight';
} 

function Card({
  className, 
  data , 
  size,
  titleSize,
  descriptionSize,
  titleColor,
  descriptionColor,
}: CardProps) {

  //이미지 cors로 오류시 no_poster로 대체
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError 
    ? '/assets/no_poster2.png' 
    : data.image;
  
  return (
    <div className={cn(CardVariants({ size }), className)}>          
      <div className="rounded-t-lg w-full lg:h-[320px] md:h-[250px] sm:h-[40vw] h-[50vw]  overflow-hidden">
        <Image 
          src={imageSrc} 
          className="w-full h-full object-cover"
          alt={data.title}
          width={400}
          height={300}
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
        />
      </div>
      <div className="py-5 px-3">
          <a href={data.url}>
              <h5 className={cn(CardVariants({ titleSize, titleColor }), 'truncate')}>{data.title}</h5>
          </a>
          <p className={cn(CardVariants({ descriptionSize, descriptionColor }), 'pb-1')}>{data.category}</p>
          <p className={cn(CardVariants({ descriptionSize, descriptionColor }))}>{data.description}</p>
      </div>
    </div>
  );
}

export default Card;

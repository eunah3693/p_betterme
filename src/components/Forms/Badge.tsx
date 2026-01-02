import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/constants/cn';

export const BadgeVariants = cva(
  `
  inline-flex
  items-center
  justify-center
  font-medium
  rounded-full
  transition-colors
  whitespace-nowrap
  `,
  {
    variants: {
      color: {
        default: 'bg-main text-white',
        bMain: 'bg-main text-white',
        bSub: 'bg-sub text-white',
        bInfo: 'bg-info text-white',
        bCaution: 'bg-caution text-white',
        bHighlight: 'bg-highlight text-white',
      },
      variant: {
        solid: '',
        outline: 'bg-transparent border-2',
        light: '',
      },
      size: {
        default: 'px-3 py-1 text-sm',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-4 py-1.5 text-sm',
        lg: 'px-5 py-2 text-base',
        xl: 'px-6 py-2.5 text-lg',
      },
    },
    compoundVariants: [
      // outline variant - 테두리만
      {
        variant: 'outline',
        color: 'default',
        className: 'border-main text-main',
      },
      {
        variant: 'outline',
        color: 'bMain',
        className: 'border-main text-main',
      },
      {
        variant: 'outline',
        color: 'bSub',
        className: 'border-sub text-sub',
      },
      {
        variant: 'outline',
        color: 'bInfo',
        className: 'border-info text-info',
      },
      {
        variant: 'outline',
        color: 'bCaution',
        className: 'border-caution text-caution',
      },
      {
        variant: 'outline',
        color: 'bHighlight',
        className: 'border-highlight text-highlight',
      },
      // light variant - 연한 배경
      {
        variant: 'light',
        color: 'default',
        className: 'bg-main/10 text-main',
      },
      {
        variant: 'light',
        color: 'bMain',
        className: 'bg-main/10 text-main',
      },
      {
        variant: 'light',
        color: 'bSub',
        className: 'bg-sub/10 text-sub',
      },
      {
        variant: 'light',
        color: 'bInfo',
        className: 'bg-info/10 text-info',
      },
      {
        variant: 'light',
        color: 'bCaution',
        className: 'bg-caution/10 text-caution',
      },
      {
        variant: 'light',
        color: 'bHighlight',
        className: 'bg-highlight/10 text-highlight',
      },
    ],
    defaultVariants: {
      color: 'default',
      variant: 'solid',
      size: 'default',
    },
  },
);

interface BadgeProps extends VariantProps<typeof BadgeVariants> {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function Badge({ 
  color, 
  variant,
  size, 
  className, 
  children,
  onClick
}: BadgeProps) {
  return (
    <span 
      className={cn(BadgeVariants({ 
        color, 
        variant,
        size, 
        className 
      }))}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

export default Badge;

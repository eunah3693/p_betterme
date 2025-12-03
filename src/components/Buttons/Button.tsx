import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/constants/cn';

export const ButtonVariants = cva(
  `
  rounded-sm 
  `,
  {
    variants: {
      color: {
        default: 'bg-main text-white',
        bMain: 'bg-white text-main border border-main',
        bSub: 'bg-white text-sub border border-sub',
        bInfo: 'bg-white text-info border border-info',
        bCation: 'bg-white text-cation border border-cation',
        bHighlight: 'bg-white text-highlight border border-highlight',
        bgMain: 'bg-main text-white',
        bgSub: 'bg-sub text-white', 
        bgInfo: 'bg-info text-white',
        bgCaution: 'bg-caution text-white',
        bgHighlight: 'bg-highlight text-white',
        bgGray: 'bg-gray-500 text-white',
        bgDanger: 'bg-red-500 text-white',
      },
      size: {
        default: 'px-2 py-1',
        sm: 'px-2 py-1',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
        xl: 'px-8 py-4',
        wFull: 'w-full',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends VariantProps<typeof ButtonVariants> {
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function Button({ color, size, className, children, onClick, type = "button", disabled }: ButtonProps) {
  return (
    <button 
      className={cn(ButtonVariants({ color, size, className }))}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children && children}
    </button>
  );
}

export default Button;

import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/constants/cn';

type ColorVariant = 'default' | 'bMain' | 'bSub' | 'bInfo' | 'bCaution' | 'bHighlight';

export const InputVariants = cva(
  `
  rounded-sm 
  placeholder:text-info
  `,
  {
    variants: {
      color: {
        default: 'bg-main text-info',
        bMain: 'bg-white text-info border border-main',
        bSub: 'bg-white text-info border border-sub',
        bInfo: 'bg-white text-info border border-info',
        bCaution: 'bg-white text-info border border-caution',
        bHighlight: 'bg-white text-info border border-highlight',
        bgray: 'bg-white text-info border border-desc',
      },
      size: {
        default: 'px-4 py-1',
        sm: 'px-4 py-1 w-full',
        md: 'px-4 py-2 w-full',
        lg: 'px-6 py-3 w-full',
        xl: 'px-8 py-4 w-full',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  },
);

interface InputProps extends VariantProps<typeof InputVariants> {
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: {
    error: boolean;
    errorMessage: string;
    errorColor: ColorVariant;
  };
  placeholder?: string;
  label?: string;
  labelClass?: string;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function Input2({ 
  color, 
  size, 
  className, 
  value, 
  onChange, 
  error = {error: false, errorMessage: '', errorColor: 'default'},
  placeholder,
  label,
  labelClass,
  type = "text",
  onKeyDown
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-[2px]">
        <label 
          htmlFor="first_name" 
          className={labelClass}
        >
          {label}
        </label>
        <input 
          type={type}
          id="first_name" 
          className={cn(InputVariants({ 
            color: error.error ? error.errorColor : color, 
            size, 
            className 
          }))}
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
      {error.error && error.errorMessage && (
        <span className="text-caution text-sm pl-2">{error.errorMessage}</span>
      )}
      
    </div>
  );
}

export default Input2;

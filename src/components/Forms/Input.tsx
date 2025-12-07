import React, { forwardRef } from 'react';
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

interface InputProps extends VariantProps<typeof InputVariants>, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  className?: string;
  error?: {
    error: boolean;
    errorMessage: string;
    errorColor: ColorVariant;
  };
  label?: string;
  labelClass?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  color, 
  size, 
  className, 
  error = {error: false, errorMessage: '', errorColor: 'default'},
  placeholder,
  label,
  labelClass,
  type = "text",
  disabled = false,
  ...rest
}, ref) => {
  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-[2px]">
        {label && (
          <label 
            htmlFor={rest.name || rest.id} 
            className={labelClass}
          >
            {label}
          </label>
        )}
        <input 
          ref={ref}
          type={type}
          className={cn(InputVariants({ 
            color: error.error ? error.errorColor : color, 
            size, 
            className 
          }))}
          placeholder={placeholder} 
          disabled={disabled}
          {...rest}
        />
      </div>
      {error.error && error.errorMessage && (
        <span className="text-caution text-sm pl-2">{error.errorMessage}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

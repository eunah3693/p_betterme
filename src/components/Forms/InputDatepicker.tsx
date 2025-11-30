import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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

interface DatePickerProps extends VariantProps<typeof InputVariants> {
  className?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  error?: {
    error: boolean;
    errorMessage: string;
    errorColor: ColorVariant;
  };
  placeholder?: string;
  label?: string;
  labelClass?: string;
  dateFormat?: string;
}

function CustomDatePicker({ 
  color, 
  size, 
  className, 
  value, 
  onChange, 
  error = {error: false, errorMessage: '', errorColor: 'default'},
  placeholder = "날짜를 선택하세요",
  label,
  labelClass,
  dateFormat = "yyyy-MM-dd"
}: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-[2px]">
        <label 
          htmlFor="datepicker" 
          className={labelClass}
        >
          {label}
        </label>
        <DatePicker
          id="datepicker"
          selected={value}
          onChange={onChange}
          dateFormat={dateFormat}
          placeholderText={placeholder}
          className={cn(InputVariants({ 
            color: error.error ? error.errorColor : color, 
            size, 
            className 
          }))}
          showPopperArrow={false}
          autoComplete="off"
          isClearable={false}
        />
      </div>
      {error.error && error.errorMessage && (
        <span className="text-caution text-sm pl-2">{error.errorMessage}</span>
      )}
      
    </div>
  );
}

export default CustomDatePicker;

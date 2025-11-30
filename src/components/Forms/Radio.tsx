import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/constants/cn';

type ColorVariant = 'default' | 'bMain' | 'bSub' | 'bInfo' | 'bCaution' | 'bHighlight';

export const RadioVariants = cva(
  `
  rounded-full
  cursor-pointer
  transition-colors
  `,
  {
    variants: {
      color: {
        default: 'accent-main',
        bMain: 'accent-main',
        bSub: 'accent-sub',
        bInfo: 'accent-info',
        bCaution: 'accent-caution',
        bHighlight: 'accent-highlight',
      },
      size: {
        default: 'w-4 h-4',
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-7 h-7',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  },
);

interface RadioProps extends VariantProps<typeof RadioVariants> {
  className?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: {
    error: boolean;
    errorMessage: string;
    errorColor: ColorVariant;
  };
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  id?: string;
  name: string;
  value: string;
}

function Radio({ 
  color, 
  size, 
  className, 
  checked, 
  onChange, 
  error = {error: false, errorMessage: '', errorColor: 'default'},
  label,
  labelClassName,
  disabled = false,
  id,
  name,
  value
}: RadioProps) {
  const radioId = id || `radio-${name}-${value}`;
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input 
          type="radio"
          id={radioId}
          name={name}
          value={value}
          className={cn(RadioVariants({ 
            color: error.error ? error.errorColor : color, 
            size, 
            className 
          }))}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        {label && (
          <label 
            htmlFor={radioId}
            className={cn(
              "cursor-pointer select-none",
              disabled && "opacity-50 cursor-not-allowed",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
      </div>
      {error.error && error.errorMessage && (
        <span className="text-caution text-sm pl-6">{error.errorMessage}</span>
      )}
    </div>
  );
}

export default Radio;

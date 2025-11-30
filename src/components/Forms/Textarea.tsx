import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/constants/cn';

type ColorVariant = 'default' | 'bMain' | 'bSub' | 'bInfo' | 'bCaution' | 'bHighlight';

export const TextareaVariants = cva(
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
      },
      size: {
        default: 'px-4 py-1',
        sm: 'px-2 py-2 w-full',
        md: 'px-4 py-4 w-full',
        lg: 'px-6 py-6 w-full',
        xl: 'px-8 py-4 w-full',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  },
);

interface TextareaProps extends VariantProps<typeof TextareaVariants> {
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: {
    error: boolean;
    errorMessage: string;
    errorColor: ColorVariant;
  };
  placeholder?: string;
}

function Textarea({ 
  color, 
  size, 
  className, 
  value, 
  onChange, 
  error = {error: false, errorMessage: '', errorColor: 'default'},
  placeholder
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <textarea 
        className={cn(TextareaVariants({ 
          color: error.error ? error.errorColor : color, 
          size, 
          className 
        }))}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      ></textarea>
      {error.error && error.errorMessage && (
        <span className="text-caution text-sm pl-2">{error.errorMessage}</span>
      )}
    </div>
  );
}

export default Textarea;

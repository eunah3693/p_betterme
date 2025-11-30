import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/constants/cn';

export const SelectVariants = cva(
  `
  rounded-sm 
  placeholder:text-info
  `,
  {
    variants: {
      color: {
        default: 'bg-white text-info border border-gray-300',
        bMain: 'bg-white text-info border border-main',
        bSub: 'bg-white text-info border border-sub',
        bInfo: 'bg-white text-info border border-info',
        bCaution: 'bg-white text-info border border-caution',
        bHighlight: 'bg-white text-info border border-highlight',
        bgray: 'bg-white text-info border border-desc',
      },
      size: {
        default: 'p-2.5',
        sm: 'p-2 text-xs',
        md: 'p-2.5 text-sm',
        lg: 'p-3 text-base',
      },
    },
    defaultVariants: {
      color: 'default',
      size: 'default',
    },
  }
);

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends VariantProps<typeof SelectVariants> {
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  labelClass?: string;
  id?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: {
    error: boolean;
    errorMessage: string;
    errorColor?: 'default' | 'bMain' | 'bSub' | 'bInfo' | 'bCaution' | 'bHighlight';
  };
}

function Select({ 
  color, 
  size, 
  className, 
  value, 
  onChange, 
  error = {error: false, errorMessage: '', errorColor: 'default'},
  label,
  labelClass = "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
  id = "select-input",
  options,
  placeholder = ""
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex flex-col gap-[2px]">
        {label && (
          <label 
            htmlFor={id} 
            className={labelClass}
          >
            {label}
          </label>
        )}
        <select 
          id={id} 
          className={cn(SelectVariants({ 
            color: error.error ? error.errorColor : color, 
            size, 
            className 
          }))}
          value={value}
          onChange={onChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error.error && error.errorMessage && (
        <span className="text-caution text-sm pl-2">{error.errorMessage}</span>
      )}
    </div>
  );
}

export default Select;

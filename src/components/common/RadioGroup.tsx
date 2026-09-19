'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { createContext, useContext, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type RadioSize = 'large' | 'medium';

const RadioGroupSizeContext = createContext<RadioSize>('large');

// 바깥 원 버튼
const radioControlVariants = cva(
  'relative shrink-0 rounded-full border border-gray-300 outline-none peer group/radio focus-visible:ring-2 focus-visible:ring-ring data-checked:border-rust-600 data-disabled:cursor-not-allowed data-disabled:border-gray-400 data-disabled:data-unchecked:bg-gray-200 data-disabled:data-checked:bg-gray-100',
  {
    variants: {
      size: {
        large: 'size-6',
        medium: 'size-5',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  }
);

// 안쪽 원
const radioIndicatorVariants = cva(
  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust-600 group-data-disabled/radio:bg-gray-400',
  {
    variants: {
      size: {
        large: 'size-2.5',
        medium: 'size-2',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  }
);

const radioLabelVariants = cva('text-gray-800', {
  variants: {
    size: {
      large:
        'text-b1 peer-data-checked:text-h3 peer-data-checked:text-gray-900 peer-data-disabled:peer-data-checked:text-b1 peer-data-disabled:peer-data-checked:text-gray-800',
      medium:
        'text-b2 peer-data-checked:text-h4 peer-data-checked:text-gray-900 peer-data-disabled:peer-data-checked:text-b2 peer-data-disabled:peer-data-checked:text-gray-800',
    },
  },
  defaultVariants: {
    size: 'large',
  },
});

const radioDescriptionVariants = cva('text-gray-600', {
  variants: {
    size: {
      large: 'text-b2',
      medium: 'text-b3',
    },
  },
  defaultVariants: {
    size: 'large',
  },
});

type RadioGroupProps = RadioGroupPrimitive.Props &
  VariantProps<typeof radioControlVariants>;

function RadioGroup({ className, size = 'large', ...props }: RadioGroupProps) {
  return (
    <RadioGroupSizeContext.Provider value={size ?? 'large'}>
      <RadioGroupPrimitive
        data-slot="radio-group"
        className={cn('flex flex-col gap-3', className)}
        {...props}
      />
    </RadioGroupSizeContext.Provider>
  );
}

type RadioProps = Omit<RadioPrimitive.Root.Props, 'className' | 'children'> & {
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
};

function Radio({ className, label, description, ...props }: RadioProps) {
  const size = useContext(RadioGroupSizeContext);

  const control = (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        radioControlVariants({ size }),
        !label && !description && className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-indicator"
        className={radioIndicatorVariants({ size })}
      />
    </RadioPrimitive.Root>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 has-data-disabled:cursor-not-allowed',
        className
      )}
    >
      {control}
      <span
        className={cn(
          'flex min-w-0 flex-col items-start',
          radioLabelVariants({ size })
        )}
      >
        {label != null && <span>{label}</span>}
        {description != null && (
          <span className={radioDescriptionVariants({ size })}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export { Radio, RadioGroup };
export type { RadioGroupProps, RadioProps };

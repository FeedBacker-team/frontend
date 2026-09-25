'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

// 바깥 박스
const checkboxControlVariants = cva(
  'group/checkbox relative flex shrink-0 items-center justify-center rounded-[4px] border border-gray-300 outline-none focus-visible:ring-2 focus-visible:ring-ring data-checked:border-rust-600 data-disabled:cursor-not-allowed data-disabled:border-gray-400 data-disabled:bg-gray-200',
  {
    variants: {
      size: {
        large: 'size-6',
        medium: 'size-4.5',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  }
);

// 체크 아이콘
const checkboxIndicatorVariants = cva(
  'mask-(--checkbox-icon) mask-center mask-contain mask-no-repeat block bg-rust-600 group-data-disabled/checkbox:bg-gray-400',
  {
    variants: {
      size: {
        large: 'size-4',
        medium: 'size-3',
      },
    },
    defaultVariants: {
      size: 'large',
    },
  }
);

const checkboxLabelVariants = cva('text-gray-800', {
  variants: {
    size: {
      large: 'text-b1',
      medium: 'text-b2',
    },
  },
  defaultVariants: {
    size: 'large',
  },
});

const checkboxDescriptionVariants = cva('text-gray-600', {
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

type CheckboxSize = VariantProps<typeof checkboxControlVariants>['size'];

type CheckBoxProps = Omit<
  CheckboxPrimitive.Root.Props,
  'className' | 'children'
> & {
  size?: CheckboxSize;
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
};

function CheckBox({
  size = 'large',
  className,
  label,
  description,
  ...props
}: CheckBoxProps) {
  const control = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        checkboxControlVariants({ size }),
        !label && !description && className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={checkboxIndicatorVariants({ size })}
        style={
          { '--checkbox-icon': `url(/icons/check.svg)` } as CSSProperties
        }
      />
    </CheckboxPrimitive.Root>
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
          checkboxLabelVariants({ size })
        )}
      >
        {label != null && <span>{label}</span>}
        {description != null && (
          <span className={checkboxDescriptionVariants({ size })}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export { CheckBox };
export type { CheckBoxProps };

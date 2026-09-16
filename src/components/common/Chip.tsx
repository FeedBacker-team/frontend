'use client';

import React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const chipVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[0.875rem] font-medium whitespace-nowrap transition-colors outline-none disabled:pointer-events-none',
  {
    variants: {
      state: {
        unchecked: 'border-gray-400 bg-white text-black',
        checked: 'border-yellow-300 bg-yellow-50 text-yellow-500',
        disabled: 'border-gray-300 bg-gray-200 text-gray-500',
      },
    },
    defaultVariants: {
      state: 'unchecked',
    },
  }
);

export type ChipState = 'unchecked' | 'checked' | 'disabled';

export interface ChipProps
  extends
    Omit<
      React.ComponentProps<typeof TogglePrimitive>,
      'pressed' | 'defaultPressed' | 'disabled' | 'onPressedChange' | 'render'
    >,
    VariantProps<typeof chipVariants> {
  label: string;
  state?: ChipState;
  onClick?: () => void;
}

function Chip({
  className,
  label,
  state = 'unchecked',
  onClick,
  ...props
}: ChipProps) {
  const isDisabled = state === 'disabled';

  return (
    <TogglePrimitive
      data-slot="chip"
      pressed={state === 'checked'}
      disabled={isDisabled}
      onPressedChange={() => onClick?.()}
      className={cn(chipVariants({ state }), className)}
      {...props}
    >
      {label}
    </TogglePrimitive>
  );
}

export { Chip, chipVariants };

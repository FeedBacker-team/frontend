'use client';

import React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const chipVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-c1 whitespace-nowrap transition-colors outline-none disabled:pointer-events-none',
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
  /** 해시태그 용도일 때만 true로. 직군 선택 등 일반 선택 칩은 기본값(false)을 씁니다. */
  hash?: boolean;
  onClick?: () => void;
}

function Chip({
  className,
  label,
  state = 'unchecked',
  hash = false,
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
      {hash ? (
        <span
          aria-hidden
          className="size-3 shrink-0 bg-current mask-[url(/icons/hash.svg)] mask-center mask-contain mask-no-repeat"
        />
      ) : null}
      {label}
    </TogglePrimitive>
  );
}

export { Chip, chipVariants };

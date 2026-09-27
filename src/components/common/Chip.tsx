'use client';

import React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

import { chipVariants, type ChipState } from '@/components/common/chip-variants';

export type { ChipState };

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

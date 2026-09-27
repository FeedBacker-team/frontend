import { cva } from 'class-variance-authority';

// Chip.tsx는 'use client'라 서버 컴포넌트에서 chipVariants를 직접 호출할 수 없어 분리했습니다.
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

type ChipState = 'unchecked' | 'checked' | 'disabled';

export { chipVariants };
export type { ChipState };

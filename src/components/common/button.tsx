'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center font-bold whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_img]:pointer-events-none [&_img]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-rust-600 text-white hover:bg-rust-700 active:bg-rust-800 active:text-rust-50 disabled:bg-rust-200 disabled:text-rust-500',
        secondary:
          'bg-rust-50 text-rust-600 border border-rust-600 hover:bg-rust-100 active:bg-rust-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300',
        outline:
          'bg-white text-gray-900 border border-gray-400 hover:border-gray-600 active:bg-gray-300 active:border-gray-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300',
      },
      size: {
        giant:
          'gap-3 rounded-[12px] px-5 py-3 text-h3 [&_svg]:size-6 [&_img]:size-6',
        large: 'gap-2 rounded-[12px] p-3 text-h4 [&_svg]:size-6 [&_img]:size-6',
        medium:
          'gap-1.5 rounded-[10px] px-4 py-2.5 text-c1 [&_svg]:size-5 [&_img]:size-5',
        small:
          'gap-1.5 rounded-[8px] px-2 py-1.5 text-c1 [&_svg]:size-4 [&_img]:size-4',
      },
    },
    compoundVariants: [
      { variant: 'outline', size: 'giant', class: 'hover:bg-gray-200' },
      { variant: 'outline', size: 'large', class: 'hover:bg-gray-200' },
      { variant: 'outline', size: 'medium', class: 'hover:bg-gray-100' },
      { variant: 'outline', size: 'small', class: 'hover:bg-gray-100' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  }
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

function Button({
  className,
  variant,
  size,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };

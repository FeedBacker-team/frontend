'use client';

import React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';

const inputVariants = cva(
  'flex w-full min-w-0 rounded-lg border bg-transparent transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-input',
        error: 'border-[#ff383c]',
        completed: 'border-green-600',
      },
      size: {
        small: 'h-9 px-2.5 py-1 text-[0.875rem]',
        medium: 'h-11 px-3 py-1.5 text-[1rem] md:text-[0.875rem]',
        large: 'h-13 px-3.5 py-2 text-[1rem]',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'medium',
    },
  }
);

export interface InputProps
  extends
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, size, icon, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        <InputPrimitive
          ref={ref}
          data-slot="input"
          className={cn(
            inputVariants({ state, size }),
            icon && 'pr-9',
            className
          )}
          {...props}
        />
        {icon && (
          <span className="absolute right-3 flex items-center text-[#555]">
            {icon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };

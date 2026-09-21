'use client';

import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { inputVariants } from '@/components/common/Input';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends
    Omit<ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof inputVariants> {}

function Textarea({ className, state, size, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        inputVariants({ state, size }),
        'h-auto min-h-27 resize-none py-3 leading-6',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

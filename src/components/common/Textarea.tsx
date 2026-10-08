'use client';

import type { ChangeEventHandler, ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';

import { inputVariants } from '@/components/common/Input';
import { emojifyShortcodes } from '@/lib/emoji';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends
    Omit<ComponentProps<'textarea'>, 'size'>,
    VariantProps<typeof inputVariants> {
  convertEmojiShortcodes?: boolean;
}

function getEmojifiedSelection(value: string, selectionPosition: number) {
  return emojifyShortcodes(value.slice(0, selectionPosition)).length;
}

function Textarea({
  className,
  state,
  size,
  convertEmojiShortcodes = false,
  onChange,
  ...props
}: TextareaProps) {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const textarea = event.currentTarget;
    const currentValue = textarea.value;
    const nextValue = convertEmojiShortcodes
      ? emojifyShortcodes(currentValue)
      : currentValue;

    if (nextValue !== currentValue) {
      const selectionStart = getEmojifiedSelection(
        currentValue,
        textarea.selectionStart
      );
      const selectionEnd = getEmojifiedSelection(
        currentValue,
        textarea.selectionEnd
      );

      textarea.value = nextValue;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }

    onChange?.(event);
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        inputVariants({ state, size }),
        'h-auto min-h-27 resize-none py-3 leading-6',
        className
      )}
      onChange={handleChange}
      {...props}
    />
  );
}

export { Textarea };

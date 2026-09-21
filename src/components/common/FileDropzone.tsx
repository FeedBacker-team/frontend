'use client';

import {
  useState,
  type ComponentProps,
  type DragEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export interface FileDropzoneProps extends Omit<
  ComponentProps<'input'>,
  'type' | 'title'
> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  state?: 'default' | 'error';
  containerClassName?: string;
}

function FileDropzone({
  title,
  description,
  icon = <img src="/icons/upload.svg" alt="파일 업로드" aria-hidden />,
  state = 'default',
  className,
  containerClassName,
  disabled,
  multiple,
  ...props
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    // preventDefault를 해야 브라우저가 drop을 허용한다.
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const input = event.currentTarget.querySelector('input');
    const dropped = Array.from(event.dataTransfer.files);
    if (disabled || !input || dropped.length === 0) {
      return;
    }

    // 드롭한 파일을 input에 넣고 change를 발생시켜, 클릭 선택과 같은 onChange 흐름을 탄다.
    const transfer = new DataTransfer();
    (multiple ? dropped : dropped.slice(0, 1)).forEach((file) =>
      transfer.items.add(file)
    );
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  return (
    <label
      data-slot="file-dropzone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed bg-gray-100 px-4 py-4.5 text-center transition-colors has-focus-visible:border-ring has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
        state === 'error'
          ? 'border-system-alert'
          : isDragging
            ? 'border-gray-600'
            : 'border-gray-400 hover:border-gray-600',
        containerClassName
      )}
    >
      <input
        type="file"
        disabled={disabled}
        multiple={multiple}
        className={cn(
          'absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      {icon}
      <span className="text-c1 text-text-default">{title}</span>
      {description ? (
        <span className="text-xs text-text-info">{description}</span>
      ) : null}
    </label>
  );
}

export { FileDropzone };

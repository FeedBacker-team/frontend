import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const toastLargeVariants = cva(
  'fixed right-[50px] bottom-[70px] z-50 flex w-fit max-w-[calc(100vw-2rem)] items-start gap-3 rounded-[12px] border p-6 shadow-[2px_2px_10px_rgba(17,17,17,0.12)]',
  {
    variants: {
      variant: {
        success: 'border-green-200 bg-green-50',
        notice: 'border-yellow-300 bg-yellow-50',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

const toastLargeTitleVariants = cva('text-h4', {
  variants: {
    variant: {
      success: 'text-green-600',
      notice: 'text-yellow-600',
    },
  },
  defaultVariants: {
    variant: 'success',
  },
});

const DEFAULT_ICON_SRC = {
  success: '/icons/success.svg',
  notice: '/icons/bell.svg',
} as const;

type ToastLargeProps = VariantProps<typeof toastLargeVariants> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  onClose: () => void;
  className?: string;
};

function ToastLarge({
  variant = 'success',
  title,
  description,
  icon,
  onClose,
  className,
}: ToastLargeProps) {
  return (
    <div
      role="status"
      className={cn(toastLargeVariants({ variant }), className)}
    >
      <div className="flex size-13 shrink-0 items-center justify-center [&_img]:size-13">
        {icon ?? (
          <Image
            src={DEFAULT_ICON_SRC[variant ?? 'success']}
            alt=""
            width={52}
            height={52}
            aria-hidden
          />
        )}
      </div>
      <div className="flex flex-col gap-1 pt-0.5">
        <p
          className={cn(
            toastLargeTitleVariants({ variant }),
            'whitespace-nowrap'
          )}
        >
          {title}
        </p>
        {description != null && (
          <p className="text-b2 whitespace-nowrap text-gray-800">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center"
      >
        <Image src="/icons/x.svg" alt="" width={24} height={24} aria-hidden />
      </button>
    </div>
  );
}

export { ToastLarge, toastLargeVariants };
export type { ToastLargeProps };

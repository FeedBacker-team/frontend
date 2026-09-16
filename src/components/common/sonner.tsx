'use client';

import type { CSSProperties } from 'react';
import {
  toast as sonnerToast,
  Toaster as Sonner,
  type ToasterProps,
} from 'sonner';

import { cn } from '@/lib/utils';

type ToastVariant = 'error' | 'success' | 'undo';

const TOAST_ICONS = {
  error: { src: '/icons/alert-circle.svg', className: 'bg-system-alert' },
  success: { src: '/icons/check.svg', className: 'bg-system-success' },
  undo: { src: '/icons/info.svg', className: 'bg-system-warning' },
} as const;

type ToastIconProps = {
  src: string;
  className: string;
};

function ToastIcon({ src, className }: ToastIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'block size-6 shrink-0 mask-(--toast-icon) mask-center mask-contain mask-no-repeat',
        className
      )}
      style={{ '--toast-icon': `url(${src})` } as CSSProperties}
    />
  );
}

type ToastViewProps = {
  id: string | number;
  variant: ToastVariant;
  message: string;
};

function ToastView({ id, variant, message }: ToastViewProps) {
  const icon = TOAST_ICONS[variant];

  return (
    <div className="flex w-110 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-[8px] bg-gray-900 px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <ToastIcon src={icon.src} className={icon.className} />
        <p className="text-c1 min-w-0 flex-1 text-white">{message}</p>
      </div>
      <button
        type="button"
        aria-label="닫기"
        className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center"
        onClick={() => sonnerToast.dismiss(id)}
      >
        <ToastIcon src="/icons/x.svg" className="bg-gray-50" />
      </button>
    </div>
  );
}

function showToast(variant: ToastVariant, message: string) {
  return sonnerToast.custom(
    (id) => <ToastView id={id} variant={variant} message={message} />,
    { duration: 3000 }
  );
}

const toast = {
  error: (message: string) => showToast('error', message),
  success: (message: string) => showToast('success', message),
  undo: (message: string) => showToast('undo', message),
};

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      duration={3000}
      gap={12}
      toastOptions={{ unstyled: true }}
      {...props}
    />
  );
}

export { Toaster, toast };
export type { ToastVariant };

'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

const DISMISS_REASONS = new Set(['escape-key', 'outside-press']);

type DialogProps = DialogPrimitive.Root.Props;

function Dialog({
  disablePointerDismissal = true,
  onOpenChange,
  ...props
}: DialogProps) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      disablePointerDismissal={disablePointerDismissal}
      onOpenChange={(open, details) => {
        if (!open && DISMISS_REASONS.has(details.reason)) {
          return;
        }
        onOpenChange?.(open, details);
      }}
      {...props}
    />
  );
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn('fixed inset-0 z-50 bg-gray-900/40', className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            'flex w-max max-w-[calc(100vw-2rem)] flex-col gap-9 rounded-[12px] bg-white px-6 pt-10 pb-6 outline-none',
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  );
}

type DialogHeaderProps = {
  className?: string;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
};

function DialogHeader({
  className,
  icon,
  title,
  description,
}: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex w-full flex-col items-center',
        icon ? 'gap-5' : 'gap-1',
        className
      )}
    >
      {icon != null && (
        <div className="flex shrink-0 rounded-[8px] bg-rust-50 p-2">
          <div className="size-8 [&_img]:size-8 [&_span]:size-8 [&_svg]:size-8">
            {icon}
          </div>
        </div>
      )}
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <DialogPrimitive.Title className="text-t3 text-text-default">
          {title}
        </DialogPrimitive.Title>
        {description != null && (
          <DialogPrimitive.Description className="text-b2 text-text-sub">
            {description}
          </DialogPrimitive.Description>
        )}
      </div>
    </div>
  );
}

function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn('w-full', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex w-full gap-2 *:flex-1', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
};
export type { DialogHeaderProps, DialogProps };

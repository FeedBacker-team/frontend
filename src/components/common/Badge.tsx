import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[8px] px-2 py-1 text-c1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_img]:shrink-0 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-bg-light text-text-sub',
        green: 'bg-green-50 text-green-600',
        rust: 'bg-rust-50 text-rust-600',
        yellow: 'bg-yellow-100 text-yellow-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type BadgeProps = useRender.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    icon?: ReactNode;
  };

function Badge({
  className,
  variant = 'default',
  icon,
  children,
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
        children: (
          <>
            {icon ? (
              <span
                data-slot="badge-icon"
                className={cn(
                  'flex h-4.25 w-4.25 shrink-0 items-center justify-center [&_img]:h-4.25 [&_img]:w-4.25 [&_svg]:h-4.25 [&_svg]:w-4.25',
                  variant === 'yellow' && '-translate-y-0.5'
                )}
              >
                {icon}
              </span>
            ) : null}
            {children}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
export type { BadgeProps };

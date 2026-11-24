'use client';

import { useEffect, useState, type ComponentProps, type MouseEvent } from 'react';

import { cn } from '@/lib/utils';

type ScrollToTopButtonProps = Omit<
  ComponentProps<'button'>,
  'children' | 'type'
> & {
  behavior?: ScrollBehavior;
  showAfter?: number;
};

function ScrollToTopButton({
  behavior = 'smooth',
  showAfter = 200,
  className,
  onClick,
  'aria-label': ariaLabel = '맨 위로 이동',
  ...props
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY >= showAfter);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateVisibility);
  }, [showAfter]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : behavior,
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-gray-800 p-0 text-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] transition-colors outline-none hover:bg-gray-700 active:bg-gray-900 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span
        aria-hidden
        className="size-6 bg-current mask-[url(/icons/arrow-up.svg)] mask-center mask-contain mask-no-repeat"
      />
    </button>
  );
}

export { ScrollToTopButton };
export type { ScrollToTopButtonProps };

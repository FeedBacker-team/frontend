import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AuthLayoutSize = 'login' | 'signup';

type AuthLayoutProps = {
  children?: ReactNode;
  size?: AuthLayoutSize;
};

const CARD_MAX_WIDTH: Record<AuthLayoutSize, string> = {
  login: 'max-w-115',
  signup: 'max-w-150',
};

function AuthLayout({ children, size = 'login' }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg-deep px-4 py-10">
      <div
        className={cn(
          'relative w-full rounded-[12px] bg-bg-default px-12 pt-13 pb-9',
          CARD_MAX_WIDTH[size]
        )}
      >
        <Link
          href="/"
          aria-label="닫기"
          className="absolute top-5 right-5 flex size-7 icon-icon-default items-center justify-center"
        >
          <Image
            src="/icons/x.svg"
            alt=""
            aria-hidden
            width={28}
            height={28}
            unoptimized
          />
        </Link>
        <div className="flex flex-col gap-8">
          <Image
            src="/images/Logo_main.svg"
            alt="Feedbacker"
            width={220}
            height={40}
            unoptimized
            className="h-10 w-auto"
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export { AuthLayout };
export type { AuthLayoutProps };

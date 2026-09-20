'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type SidebarNavItemProps = {
  href: string;
  label: string;
  iconSrc: string;
  collapsed?: boolean;
};

function SidebarNavItem({
  href,
  label,
  iconSrc,
  collapsed = false,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive =
    href === '/'
      ? pathname === '/' || pathname === '/ex'
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex h-11 items-center rounded-lg px-4 text-c1 transition-colors',
        collapsed ? 'w-full justify-center' : 'w-full gap-3',
        isActive
          ? 'bg-rust-50 text-rust-600'
          : 'bg-transparent text-gray-900 hover:bg-gray-200'
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-5 shrink-0 mask-(--nav-icon) mask-center mask-contain mask-no-repeat',
          isActive ? 'bg-rust-600' : 'bg-gray-800'
        )}
        style={{ '--nav-icon': `url(${iconSrc})` } as CSSProperties}
      />
      {collapsed ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="min-w-0 flex-1">{label}</span>
      )}
    </Link>
  );
}

export { SidebarNavItem };
export type { SidebarNavItemProps };

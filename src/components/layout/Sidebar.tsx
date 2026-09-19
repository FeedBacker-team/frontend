'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

import { SidebarNavItem } from './SidebarNavItem';

const NAV_ITEMS = [
  {
    href: '/',
    label: '프로젝트 둘러보기',
    iconSrc: '/icons/flag.svg',
  },
  {
    href: '/qa',
    label: '모집 중인 QA',
    iconSrc: '/icons/megaphone.svg',
  },
  {
    href: '/mypage',
    label: '마이페이지',
    iconSrc: '/icons/mypage.svg',
  },
] as const;

function Sidebar() {
  // const [isLoggedIn] = useState(false);
  const [isLoggedIn] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex min-h-0 max-h-[85vh] shrink-0 flex-col self-stretch bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)]',
        isCollapsed ? 'w-20 rounded-xl py-11' : 'w-55 rounded-2xl pt-11 pb-6'
      )}
    >
      <div
        className={cn(
          'flex h-15 shrink-0 items-center',
          isCollapsed ? 'justify-center' : 'justify-between px-6 py-1.5'
        )}
      >
        {!isCollapsed && (
          <Link href="/" className="relative h-12 shrink-0 overflow-clip">
            <Image
              src="/images/Logo_symbol.svg"
              alt="Feedbacker"
              width={53}
              height={48}
              unoptimized
              className="h-full w-auto object-contain"
            />
          </Link>
        )}
        <Button
          variant="outline"
          size="medium"
          aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <Image
            src="/icons/sidebar.svg"
            alt=""
            aria-hidden
            width={20}
            height={20}
            unoptimized
          />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between px-4 py-8">
        <nav
          className={cn(
            'flex flex-col gap-1',
            isCollapsed ? 'items-center' : 'items-stretch'
          )}
        >
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              iconSrc={item.iconSrc}
              collapsed={isCollapsed}
            />
          ))}
        </nav>

        {isLoggedIn && !isCollapsed && (
          <div className="relative flex w-full flex-col items-center gap-2 rounded-xl border border-gray-400 bg-white p-3 shadow-[2px_2px_8px_0_rgba(0,0,0,0.1)]">
            <div className="relative flex h-37.5 w-full items-center justify-center bg-yellow-50">
              <Image
                src="/images/4th_tree.svg"
                alt=""
                aria-hidden
                width={96}
                height={100}
                unoptimized
                className="h-25 w-24 object-contain"
              />
              <div className="absolute top-0 right-2 flex items-center gap-0.5 rounded-b-lg bg-green-50 px-2 py-1 text-green-700">
                <span
                  aria-hidden
                  className="size-4 shrink-0 bg-current mask-[url(/icons/droplet.svg)] mask-center mask-contain mask-no-repeat"
                />
                <span className="text-c1">100%</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-c2 text-yellow-600">
                4단계
              </span>
              <span className="text-c1 whitespace-nowrap text-yellow-800">
                풍성한 도토리 나무
              </span>
            </div>
          </div>
        )}
      </div>

      {isCollapsed ? (
        isLoggedIn ? (
          <div className="flex items-center justify-center border-t border-gray-400 px-4 pt-4">
            <div className="size-8 shrink-0 rounded-full bg-gray-200" />
          </div>
        ) : null
      ) : (
        <>
          <div className="h-px bg-gray-400" />
          {isLoggedIn ? (
            <div className="flex items-center gap-3 p-4">
              <div className="size-8 shrink-0 rounded-full bg-gray-200" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-c1 text-gray-900">닉네임</span>
                <span className="flex items-center gap-2">
                  <Image
                    src="/images/acorn.svg"
                    alt=""
                    aria-hidden
                    width={12}
                    height={16}
                    unoptimized
                    className="h-4 w-3 object-contain"
                  />
                  <span className="text-c1 text-yellow-800">60</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex h-30 flex-col justify-end gap-2 p-4">
              <Button variant="primary" size="medium" className="w-full">
                로그인
              </Button>
              <Button variant="outline" size="medium" className="w-full">
                회원가입
              </Button>
            </div>
          )}
        </>
      )}
    </aside>
  );
}

export { Sidebar };

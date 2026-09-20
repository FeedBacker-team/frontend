'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Sidebar } from '@/components/layout/Sidebar';

const HIDE_SHELL = ['/ex'];
const HIDE_FOOTER = ['/projects/new'];

/**
 * 기본: 사이드바 + 푸터
 *
 * HIDE_SHELL  — 사이드바·푸터 둘 다 없음. 경로 prefix.
 *               예: '/ex' → /ex, /ex/toast
 *
 * HIDE_FOOTER — 사이드바는 있고 푸터만 없음. 경로 prefix.
 *               예: '/projects/new'(주소는 예시입니다)
 *               수정 페이지(/projects/:id/edit)는 아래 정규식으로 따로 처리.
 *
 * 예외 페이지가 생기면 해당 배열에 경로를 추가한다.
 */

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function shouldHideFooter(pathname: string) {
  if (matchesPrefix(pathname, HIDE_FOOTER)) {
    return true;
  }

  return /^\/projects\/[^/]+\/edit\/?$/.test(pathname);
}

type AppShellProps = {
  children: ReactNode;
};

function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const hideShell = matchesPrefix(pathname, HIDE_SHELL);
  const hideFooter = shouldHideFooter(pathname);

  if (hideShell) {
    return children;
  }

  return (
    <div className="w-full sm:min-w-app-canvas">
      <div className="sm:mx-auto sm:w-app-canvas">
        <div className="flex items-stretch gap-10 p-10">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      {hideFooter ? null : <Footer />}
    </div>
  );
}

export { AppShell };

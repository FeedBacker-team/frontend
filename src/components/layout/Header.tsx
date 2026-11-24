'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { AuthError } from '@/apis/auth';
import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { useLogout } from '@/hooks/useAuth';
import { clearAuthSession } from '@/lib/auth/session';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

const NAV_ITEMS = [
  {
    href: '/',
    label: '프로젝트 둘러보기',
    iconSrc: '/icons/flag.svg',
    widthClassName: 'w-[150px]',
    isActive: (pathname: string) =>
      pathname === '/' ||
      pathname === '/ex' ||
      pathname === '/projects' ||
      pathname.startsWith('/projects/'),
  },
  {
    href: '/qa',
    label: '유저 테스트 · QA 모집',
    iconSrc: '/icons/megaphone.svg',
    widthClassName: 'w-[169px]',
    isActive: (pathname: string) =>
      pathname === '/qa' || pathname.startsWith('/qa/'),
  },
  {
    href: '/mypage',
    label: '마이페이지',
    iconSrc: '/icons/mypage.svg',
    widthClassName: 'w-28',
    isActive: (pathname: string) =>
      pathname === '/mypage' || pathname.startsWith('/mypage/'),
  },
] as const;

type HeaderNavItemProps = (typeof NAV_ITEMS)[number] & {
  pathname: string;
};

function HeaderNavItem({
  href,
  label,
  iconSrc,
  widthClassName,
  isActive,
  pathname,
}: HeaderNavItemProps) {
  const active = isActive(pathname);

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex h-16 items-center justify-center gap-1 px-4 text-h5',
        widthClassName,
        active ? 'text-rust-600' : 'text-gray-500'
      )}
    >
      <span
        aria-hidden
        className="size-4 shrink-0 bg-current mask-center mask-contain mask-no-repeat"
        style={{ maskImage: `url(${iconSrc})` }}
      />
      <span className="whitespace-nowrap">{label}</span>
      {active ? (
        <span
          aria-hidden
          className="absolute -inset-x-px bottom-0 h-0.5 rounded-full bg-rust-600"
        />
      ) : null}
    </Link>
  );
}

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const authStatus = useAuthStore((state) => state.status);
  const { mutate: logoutAccount, isPending: isLoggingOut } = useLogout();
  const isLoggedIn = authStatus === 'authenticated';

  const handleLogout = () => {
    logoutAccount(undefined, {
      onSuccess: () => {
        clearAuthSession();
        queryClient.clear();
        router.replace('/');
      },
      onError: (error) => {
        toast.error(
          error instanceof AuthError ? error.message : '로그아웃에 실패했습니다'
        );
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 h-16.25 w-full min-w-app-canvas border-b border-gray-300 bg-white">
      <div className="mx-auto flex h-16 w-app-canvas items-center justify-between px-10">
        <Link
          href="/"
          aria-label="Feedbacker 홈"
          className="flex h-16 w-39.5 shrink-0 items-center"
        >
          <Image
            src="/images/Logo_main.svg"
            alt="Feedbacker"
            width={158}
            height={28}
            loading="eager"
            unoptimized
          />
        </Link>

        <nav aria-label="주요 메뉴" className="flex h-16 w-120 gap-6">
          {NAV_ITEMS.map((item) => (
            <HeaderNavItem key={item.href} {...item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex h-16 w-39.5 shrink-0 items-center justify-end gap-5">
          {/* 알림 기능이 완성되면 반영할 예정 */}
          {/* <button
            type="button"
            aria-label="알림"
            className="inline-flex size-6 items-center justify-center text-gray-900"
          >
            <Bell aria-hidden size={24} strokeWidth={1.5} />
          </button> */}

          {authStatus === 'initializing' ? (
            <div aria-hidden className="h-10 w-20" />
          ) : isLoggedIn ? (
            <Button
              variant="outline"
              size="medium"
              className="w-20"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          ) : (
            <Button
              variant="primary"
              size="medium"
              className="w-20"
              onClick={() => router.push('/login')}
            >
              로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header };

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/common/Button';
import { toast } from '@/components/common/Sonner';
import { AuthError } from '@/apis/auth';
import { getTreeStageByHumidity } from '@/constants/mypage';
import { useLogout } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { clearAuthSession } from '@/lib/auth/session';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

import { SidebarNavItem } from './SidebarNavItem';

const NAV_ITEMS = [
  {
    href: '/',
    label: '프로젝트 둘러보기',
    iconSrc: '/icons/flag.svg',
    activePaths: ['/', '/ex', '/projects'],
  },
  {
    href: '/qa',
    label: '모집 중인 QA',
    iconSrc: '/icons/megaphone.svg',
    activePaths: ['/qa'],
  },
  {
    href: '/mypage',
    label: '마이페이지',
    iconSrc: '/icons/mypage.svg',
    activePaths: ['/mypage'],
  },
] as const;

const TREE_CARD_CLASS =
  'relative flex h-51.5 w-full shrink-0 flex-col items-center gap-2 rounded-xl border border-gray-400 bg-white p-3 shadow-[2px_2px_8px_0_rgba(0,0,0,0.1)]';

type SidebarTreeSkeletonProps = {
  isError: boolean;
};

function SidebarTreeSkeleton({ isError }: SidebarTreeSkeletonProps) {
  return (
    <div
      role="status"
      className={cn(TREE_CARD_CLASS, !isError && 'animate-pulse')}
    >
      <div className="relative flex h-37.5 w-full items-center justify-center bg-gray-100">
        <div className="h-25 w-24 rounded-xl bg-bg-deep" />
        <div className="absolute top-0 right-2 h-7 w-14 rounded-b-lg bg-bg-deep" />
      </div>
      <div className="flex h-6 items-center gap-1">
        <div className="h-6 w-12 rounded-full bg-bg-deep" />
        <div className="h-4 w-14 rounded-md bg-bg-deep" />
      </div>
      <span className="sr-only">
        {isError ? '나무 정보를 불러오지 못했습니다' : '나무 정보 불러오는 중'}
      </span>
    </div>
  );
}

type SidebarTreeCardProps = {
  imageSrc: string;
  humidity: number;
  stage: number;
  stageLabel: string;
};

function SidebarTreeCard({
  imageSrc,
  humidity,
  stage,
  stageLabel,
}: SidebarTreeCardProps) {
  return (
    <div className={TREE_CARD_CLASS}>
      <div className="relative flex h-37.5 w-full items-center justify-center bg-yellow-50">
        <Image
          src={imageSrc}
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
          <span className="text-c1">{humidity}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-c2 text-yellow-600">
          {stage}단계
        </span>
        <span className="text-c1 whitespace-nowrap text-yellow-800">
          {stageLabel}
        </span>
      </div>
    </div>
  );
}

function SidebarProfileSkeleton() {
  return (
    <div
      role="status"
      className="flex h-30 shrink-0 animate-pulse flex-col gap-3 p-4"
    >
      <div className="flex h-8 items-center gap-3">
        <div className="size-8 shrink-0 rounded-full bg-bg-deep" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-3.5 w-20 rounded-md bg-bg-deep" />
          <div className="h-3.5 w-10 rounded-md bg-bg-deep" />
        </div>
      </div>
      <div className="h-10 rounded-[10px] bg-bg-deep" />
      <span className="sr-only">프로필 불러오는 중</span>
    </div>
  );
}

function SidebarCollapsedSkeleton() {
  return (
    <div
      role="status"
      className="flex animate-pulse flex-col items-center gap-3 border-t border-gray-400 px-4 pt-4"
    >
      <div className="size-8 rounded-full bg-bg-deep" />
      <div className="size-10 rounded-[10px] bg-bg-deep" />
      <span className="sr-only">계정 정보 불러오는 중</span>
    </div>
  );
}

function Sidebar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authStatus = useAuthStore((state) => state.status);
  const isProfileCompleted = useAuthStore(
    (state) => state.isProfileCompleted
  );
  const { mutate: logoutAccount, isPending: isLoggingOut } = useLogout();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLoggedIn = authStatus === 'authenticated';
  const { data: profile, isError: isProfileError } = useProfile({
    enabled: isLoggedIn && isProfileCompleted,
  });
  const treeStage = profile
    ? getTreeStageByHumidity(profile.humidity)
    : null;
  const profileImageSrc =
    profile?.profile_image_url || '/icons/basic-avatars.svg';
  const isAuthInitializing = authStatus === 'initializing';
  const isProfileLoading =
    isLoggedIn && isProfileCompleted && !profile && !isProfileError;
  const showAuthenticatedTreeSlot = isLoggedIn && isProfileCompleted;
  const profileLabel = profile
    ? profile.nickname
    : isProfileError
      ? '프로필 조회 실패'
      : '프로필 미완성';

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
    <aside
      className={cn(
        'flex min-h-[85vh] max-h-[85vh] shrink-0 flex-col self-stretch bg-gray-50 shadow-[0_0_8px_0_rgba(0,0,0,0.1)]',
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
              activePaths={item.activePaths}
              collapsed={isCollapsed}
            />
          ))}
        </nav>

        {!isCollapsed && isAuthInitializing ? (
          <div aria-hidden className="h-51.5 w-full shrink-0" />
        ) : null}
        {!isCollapsed && showAuthenticatedTreeSlot ? (
          profile && treeStage ? (
            <SidebarTreeCard
              imageSrc={treeStage.treeImageSrc}
              humidity={profile.humidity}
              stage={treeStage.stage}
              stageLabel={treeStage.stageLabel}
            />
          ) : (
            <SidebarTreeSkeleton isError={isProfileError} />
          )
        ) : null}
      </div>

      {isCollapsed ? (
        isAuthInitializing ? (
          <div
            aria-hidden
            className="h-25 shrink-0 border-t border-gray-400"
          />
        ) : isProfileLoading ? (
          <SidebarCollapsedSkeleton />
        ) : isLoggedIn ? (
          <div className="flex flex-col items-center gap-3 border-t border-gray-400 px-4 pt-4">
            <Image
              src={profileImageSrc}
              alt={profile ? `${profile.nickname} 프로필` : ''}
              width={32}
              height={32}
              unoptimized
              className="size-8 shrink-0 rounded-full bg-gray-200 object-cover"
            />
            <Button
              variant="outline"
              size="medium"
              aria-label="로그아웃"
              disabled={!isLoggedIn || isLoggingOut}
              onClick={handleLogout}
            >
              <Image
                src="/icons/log-out.svg"
                alt=""
                aria-hidden
                width={20}
                height={20}
                unoptimized
              />
            </Button>
          </div>
        ) : null
      ) : (
        <>
          <div className="h-px bg-gray-400" />
          {isAuthInitializing ? (
            <div aria-hidden className="h-30 shrink-0" />
          ) : isProfileLoading ? (
            <SidebarProfileSkeleton />
          ) : isLoggedIn ? (
            <div
              className="flex h-30 shrink-0 flex-col gap-3 p-4"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={profileImageSrc}
                  alt={profile ? `${profile.nickname} 프로필` : ''}
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 shrink-0 rounded-full bg-gray-200 object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-c1 text-gray-900">
                    {profileLabel}
                  </span>
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
                    <span className="text-c1 text-yellow-800">
                      {profile?.acorn ?? '-'}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="medium"
                className="w-full"
                leftIcon={
                  <Image
                    src="/icons/log-out.svg"
                    alt=""
                    aria-hidden
                    width={20}
                    height={20}
                    unoptimized
                  />
                }
                disabled={!isLoggedIn || isLoggingOut}
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </div>
          ) : authStatus === 'unauthenticated' ? (
            <div className="flex h-30 flex-col justify-end gap-2 p-4">
              <Button
                variant="primary"
                size="medium"
                className="w-full"
                onClick={() => router.push('/login')}
              >
                로그인
              </Button>
              <Button
                variant="outline"
                size="medium"
                className="w-full"
                onClick={() => router.push('/signup')}
              >
                회원가입
              </Button>
            </div>
          ) : null}
        </>
      )}
    </aside>
  );
}

export { Sidebar };

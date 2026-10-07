'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { ProfileRequiredDialog } from '@/components/domain/shared/ProfileRequiredDialog';
import { useAuthStore } from '@/stores/authStore';

function getCurrentRelativeUrl() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function getProfileCompletionHref(returnTo: string) {
  const searchParams = new URLSearchParams({ next: returnTo });

  return `/profile?${searchParams.toString()}`;
}

type RequireCompletedProfileProps = {
  children: ReactNode;
  fallbackHref: string;
};

function RequireCompletedProfile({
  children,
  fallbackHref,
}: RequireCompletedProfileProps) {
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);
  const isProfileCompleted = useAuthStore(
    (state) => state.isProfileCompleted
  );
  const [isDialogDismissed, setIsDialogDismissed] = useState(false);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authStatus, router]);

  if (authStatus === 'initializing') {
    return (
      <div
        role="status"
        aria-label="사용자 정보를 확인하는 중"
        aria-busy="true"
        className="min-h-100"
      />
    );
  }

  if (authStatus === 'unauthenticated') {
    return null;
  }

  if (!isProfileCompleted) {
    return (
      <ProfileRequiredDialog
        open={!isDialogDismissed}
        onClose={() => {
          setIsDialogDismissed(true);
          router.replace(fallbackHref);
        }}
        onCompleteProfile={() => {
          router.push(getProfileCompletionHref(getCurrentRelativeUrl()));
        }}
      />
    );
  }

  return children;
}

export { RequireCompletedProfile };

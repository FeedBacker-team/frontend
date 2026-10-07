'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

import { LoginRequiredDialog } from '@/components/domain/shared/LoginRequiredDialog';
import { ProfileRequiredDialog } from '@/components/domain/shared/ProfileRequiredDialog';
import { useAuthStore } from '@/stores/authStore';

type ActionGuardContextValue = {
  runProtectedAction: (action: () => void) => void;
};

const ActionGuardContext = createContext<ActionGuardContextValue | null>(null);

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

type ActionGuardProviderProps = {
  children: ReactNode;
};

function ActionGuardProvider({ children }: ActionGuardProviderProps) {
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);
  const isProfileCompleted = useAuthStore(
    (state) => state.isProfileCompleted
  );
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isProfileRequiredOpen, setIsProfileRequiredOpen] = useState(false);
  const [profileReturnTo, setProfileReturnTo] = useState('/');

  const runProtectedAction = (action: () => void) => {
    if (authStatus === 'initializing') {
      return;
    }

    if (authStatus === 'unauthenticated') {
      setIsLoginRequiredOpen(true);
      return;
    }

    if (!isProfileCompleted) {
      setProfileReturnTo(getCurrentRelativeUrl());
      setIsProfileRequiredOpen(true);
      return;
    }

    action();
  };

  return (
    <ActionGuardContext.Provider value={{ runProtectedAction }}>
      {children}

      <LoginRequiredDialog
        open={isLoginRequiredOpen}
        onOpenChange={setIsLoginRequiredOpen}
      />
      <ProfileRequiredDialog
        open={isProfileRequiredOpen}
        onClose={() => setIsProfileRequiredOpen(false)}
        onCompleteProfile={() => {
          setIsProfileRequiredOpen(false);
          router.push(getProfileCompletionHref(profileReturnTo));
        }}
      />
    </ActionGuardContext.Provider>
  );
}

function useActionGuard() {
  const context = useContext(ActionGuardContext);

  if (!context) {
    throw new Error('useActionGuard는 ActionGuardProvider 안에서 사용해야 합니다.');
  }

  return context;
}

export { ActionGuardProvider, useActionGuard };

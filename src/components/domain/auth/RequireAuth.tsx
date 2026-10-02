'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { useAuthStore } from '@/stores/authStore';

type RequireAuthProps = {
  children: ReactNode;
};

function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authStatus, router]);

  if (authStatus !== 'authenticated') {
    return null;
  }

  return children;
}

export { RequireAuth };

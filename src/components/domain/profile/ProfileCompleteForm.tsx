'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { ProfileForm } from '@/components/domain/shared/ProfileForm';
import { profileKeys } from '@/hooks/useProfile';
import { useTags } from '@/hooks/useTags';
import { completeAuthProfile } from '@/lib/auth/session';
import { useAuthStore } from '@/stores/authStore';

function ProfileCompleteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authStatus = useAuthStore((state) => state.status);
  const isProfileCompleted = useAuthStore(
    (state) => state.isProfileCompleted
  );
  const { isPending: isTagsPending } = useTags();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (authStatus === 'authenticated' && isProfileCompleted) {
      router.replace('/');
    }
  }, [authStatus, isProfileCompleted, router]);

  const handleSuccess = () => {
    completeAuthProfile();
    void queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    router.replace('/');
  };

  if (
    authStatus !== 'authenticated' ||
    isProfileCompleted ||
    isTagsPending
  ) {
    return (
      <div
        role="status"
        aria-label="프로필 정보를 불러오는 중"
        aria-busy="true"
        className="min-h-dvh bg-bg-deep"
      />
    );
  }

  return (
    <AuthLayout size="signup" showLogo={false}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-h1 text-text-default">프로필 완성하기</h1>
          <p className="text-b2 text-text-sub">
            프로젝트 참여를 위해 간단히 나를 소개해 주세요.
          </p>
        </div>
        <ProfileForm
          submitLabel="프로필 저장하고 시작하기"
          onSuccess={handleSuccess}
        />
      </div>
    </AuthLayout>
  );
}

export { ProfileCompleteForm };

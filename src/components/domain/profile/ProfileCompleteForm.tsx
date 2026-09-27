'use client';

import { useRouter } from 'next/navigation';

import { ProfileForm } from '@/components/domain/shared/ProfileForm';

function ProfileCompleteForm() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 text-text-default">프로필 완성하기</h1>
        <p className="text-b2 text-text-sub">
          프로젝트 참여를 위해 간단히 나를 소개해 주세요.
        </p>
      </div>
      <ProfileForm
        submitLabel="프로필 저장하고 시작하기"
        onSuccess={() => router.push('/')}
      />
    </div>
  );
}

export { ProfileCompleteForm };

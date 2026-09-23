import type { Metadata } from 'next';

import { AuthLayout } from '@/components/domain/auth/AuthLayout';
import { ProfileCompleteForm } from '@/components/domain/profile/ProfileCompleteForm';

export const metadata: Metadata = {
  title: '프로필 완성하기',
};

export default function ProfileCompletePage() {
  return (
    <AuthLayout size="signup" showLogo={false}>
      <ProfileCompleteForm />
    </AuthLayout>
  );
}

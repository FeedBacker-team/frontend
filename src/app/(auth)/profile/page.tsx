import type { Metadata } from 'next';

import { ProfileCompleteForm } from '@/components/domain/profile/ProfileCompleteForm';

export const metadata: Metadata = {
  title: '프로필 완성하기',
};

export default function ProfilePage() {
  return <ProfileCompleteForm />;
}

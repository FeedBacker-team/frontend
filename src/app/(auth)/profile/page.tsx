import type { Metadata } from 'next';

import { ProfileCompleteForm } from '@/components/domain/profile/ProfileCompleteForm';

export const metadata: Metadata = {
  title: '프로필 완성하기',
};

type ProfilePageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function getSafeReturnTo(value: string | string[] | undefined) {
  const returnTo = typeof value === 'string' ? value : '/';

  if (
    !returnTo.startsWith('/') ||
    returnTo.startsWith('//') ||
    returnTo.includes('\\')
  ) {
    return '/';
  }

  const pathname = returnTo.split(/[?#]/, 1)[0];

  return pathname === '/profile' || pathname.startsWith('/profile/')
    ? '/'
    : returnTo;
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;

  return <ProfileCompleteForm returnTo={getSafeReturnTo(params.next)} />;
}

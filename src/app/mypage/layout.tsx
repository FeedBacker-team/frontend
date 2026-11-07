import type { Metadata } from 'next';

import { RequireAuth } from '@/components/domain/auth/RequireAuth';
import { createRobotsMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  robots: createRobotsMetadata(false),
};

export default function MyPageLayout({ children }: LayoutProps<'/mypage'>) {
  return <RequireAuth>{children}</RequireAuth>;
}

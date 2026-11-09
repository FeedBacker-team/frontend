import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { createRobotsMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  robots: createRobotsMetadata(false),
};

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return children;
}

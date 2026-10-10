import type { Metadata } from 'next';

import { Toaster } from '@/components/common/Sonner';
import { TooltipProvider } from '@/components/common/Tooltip';
import { ActionGuardProvider } from '@/components/domain/auth/ActionGuardProvider';
import { AuthInitializer } from '@/components/domain/auth/AuthInitializer';
import { AppShell } from '@/components/layout/AppShell';
import {
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '@/constants/metadata';
import { QueryProvider } from '@/lib/QueryProvider';
import { createRobotsMetadata } from '@/lib/seo/metadata';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Feedbacker',
  },
  description: SITE_DESCRIPTION,
  robots: createRobotsMetadata(),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'Feedbacker',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 2400,
        height: 1200,
        alt: 'Feedbacker - 메이커들과 함께하는 QA 품앗이 플랫폼',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <AuthInitializer />
          <TooltipProvider>
            <ActionGuardProvider>
              <AppShell>{children}</AppShell>
              <Toaster />
            </ActionGuardProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

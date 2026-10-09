import type { Metadata } from 'next';

import { Toaster } from '@/components/common/Sonner';
import { TooltipProvider } from '@/components/common/Tooltip';
import { ActionGuardProvider } from '@/components/domain/auth/ActionGuardProvider';
import { AuthInitializer } from '@/components/domain/auth/AuthInitializer';
import { AppShell } from '@/components/layout/AppShell';
import { QueryProvider } from '@/lib/QueryProvider';

import './globals.css';

const SITE_URL = 'https://feedbacker.co.kr';
const SITE_TITLE = 'Feedbacker | 메이커들과 함께하는 QA 품앗이 플랫폼';
const SITE_DESCRIPTION =
  '프로젝트를 등록해 QA 참여자를 모집하고, 다른 메이커의 서비스를 테스트하며 피드백과 도토리를 주고받아 보세요.';
const OG_IMAGE_URL = '/og/feedbacker-og.png';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Feedbacker',
  },
  description: SITE_DESCRIPTION,
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

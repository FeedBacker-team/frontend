import type { Metadata } from 'next';

import { Toaster } from '@/components/common/Sonner';
import { TooltipProvider } from '@/components/common/Tooltip';
import { AppShell } from '@/components/layout/AppShell';
import { QueryProvider } from '@/lib/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Feedbacker',
    template: '%s | Feedbacker', // 페이지별 title을 설정할때 사용되는 템플릿
  },
  description:
    '만든 서비스를 홍보하고, 실제 사용자에게 피드백과 테스트를 받는 플랫폼입니다.',
  metadataBase: new URL('http://localhost:3000'), // 추후 배포 시 도메인 주소로 변경 필요
  openGraph: {
    title: 'Feedbacker',
    description:
      '만든 서비스를 홍보하고, 실제 사용자에게 피드백과 테스트를 받는 플랫폼입니다.',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/og_image.png', // 카카오톡 링크 공유 시 표시되는 이미지
        width: 1200,
        height: 630,
        alt: 'Feedbacker',
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
            <Toaster />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

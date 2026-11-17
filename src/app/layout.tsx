import type { Metadata } from 'next';
import Script from 'next/script';

import { Toaster } from '@/components/common/Sonner';
import { TooltipProvider } from '@/components/common/Tooltip';
import { ActionGuardProvider } from '@/components/domain/auth/ActionGuardProvider';
import { AuthInitializer } from '@/components/domain/auth/AuthInitializer';
import { AppShell } from '@/components/layout/AppShell';
import {
  IS_PRODUCTION_DEPLOYMENT,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from '@/constants/metadata';
import { QueryProvider } from '@/lib/QueryProvider';
import { createRobotsMetadata } from '@/lib/seo/metadata';

import './globals.css';

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// ChatGPT, Perplexity, Gemini 등 AI 답변 엔진에서 유입된 세션을
// GA4에서 바로 구분해 볼 수 있도록 리퍼러 호스트를 별도 이벤트로 기록한다.
const AI_REFERRER_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'gemini.google.com',
  'claude.ai',
  'copilot.microsoft.com',
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Feedbacker',
  },
  description: SITE_DESCRIPTION,
  verification: {
    other: {
      'naver-site-verification':
        '3c0eb3ba340883f08189ac1b2ef6a46b68267ef8',
    },
  },
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
        {IS_PRODUCTION_DEPLOYMENT && GOOGLE_ANALYTICS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(GOOGLE_ANALYTICS_ID)});

                (function () {
                  try {
                    var referrerHost = document.referrer
                      ? new URL(document.referrer).hostname.replace(/^www\\./, '')
                      : '';
                    var aiHosts = ${JSON.stringify(AI_REFERRER_HOSTS)};
                    var matchedHost = aiHosts.find(function (host) {
                      return referrerHost === host || referrerHost.endsWith('.' + host);
                    });

                    if (matchedHost) {
                      gtag('event', 'ai_referral', { ai_source: matchedHost });
                    }
                  } catch (error) {}
                })();
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

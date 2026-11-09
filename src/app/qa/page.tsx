import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getQaRecruitments } from '@/apis/qaRecruitments';
import { QaBrowse } from '@/components/domain/qa/browse/QaBrowse';
import { QaSidebar } from '@/components/domain/qa/browse/QaSidebar';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/constants/metadata';
import { BROWSE_QA_PAGE_SIZE } from '@/constants/qa';
import { qaRecruitmentKeys } from '@/lib/qa/queryKeys';
import type { QaRecruitmentListParams } from '@/types/qa';

const QA_PAGE_TITLE = '사이드 프로젝트 유저 테스트·QA 모집';
const QA_PAGE_DESCRIPTION =
  '사이드 프로젝트의 유저 테스트와 서비스 QA 참여자를 모집하거나, 다른 메이커의 테스트에 참여해 실제 사용 경험과 피드백을 나눠보세요.';
const QA_PAGE_URL = `${SITE_URL}/qa`;

const INITIAL_QA_LIST_PARAMS = {
  sort: 'LATEST',
  page: 0,
  size: BROWSE_QA_PAGE_SIZE,
} satisfies QaRecruitmentListParams;

export const metadata: Metadata = {
  title: {
    absolute: `Feedbacker | ${QA_PAGE_TITLE}`,
  },
  description: QA_PAGE_DESCRIPTION,
  alternates: {
    canonical: QA_PAGE_URL,
  },
};

export const dynamic = 'force-dynamic';

const QA_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: QA_PAGE_TITLE,
  description: QA_PAGE_DESCRIPTION,
  url: QA_PAGE_URL,
  inLanguage: 'ko-KR',
  isPartOf: {
    '@id': `${SITE_URL}/#website`,
  },
  about: [
    {
      '@type': 'Thing',
      name: '사이드 프로젝트 QA',
    },
    {
      '@type': 'Thing',
      name: '유저 테스트',
    },
    {
      '@type': 'Thing',
      name: '서비스 피드백',
    },
  ],
};

export default async function QaPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: qaRecruitmentKeys.list(INITIAL_QA_LIST_PARAMS),
    queryFn: ({ signal }) =>
      getQaRecruitments(INITIAL_QA_LIST_PARAMS, signal),
  });

  return (
    <>
      <JsonLd data={QA_STRUCTURED_DATA} />
      <div className="flex gap-10">
        <main className="min-w-0 flex-1">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={null}>
              <QaBrowse />
            </Suspense>
          </HydrationBoundary>
        </main>
        <aside className="w-80 shrink-0">
          <QaSidebar />
        </aside>
      </div>
    </>
  );
}

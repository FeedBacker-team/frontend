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
import { BROWSE_QA_PAGE_SIZE } from '@/constants/qa';
import { SITE_URL } from '@/constants/metadata';
import { qaRecruitmentKeys } from '@/lib/qa/queryKeys';
import type { QaRecruitmentListParams } from '@/types/qa';

const INITIAL_QA_LIST_PARAMS = {
  sort: 'LATEST',
  page: 0,
  size: BROWSE_QA_PAGE_SIZE,
} satisfies QaRecruitmentListParams;

export const metadata: Metadata = {
  title: {
    absolute: 'Feedbacker | 사이드 프로젝트 유저 테스트·QA 모집',
  },
  description:
    '사이드 프로젝트의 유저 테스트와 서비스 QA 참여자를 모집하거나, 다른 메이커의 테스트에 참여해 실제 사용 경험과 피드백을 나눠보세요.',
  alternates: {
    canonical: `${SITE_URL}/qa`,
  },
};

export const dynamic = 'force-dynamic';

export default async function QaPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: qaRecruitmentKeys.list(INITIAL_QA_LIST_PARAMS),
    queryFn: ({ signal }) =>
      getQaRecruitments(INITIAL_QA_LIST_PARAMS, signal),
  });

  return (
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
  );
}

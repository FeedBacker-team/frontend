import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getProjects } from '@/apis/project';
import { HomeBanner } from '@/components/domain/home/HomeBanner';
import { HomeProjectBrowse } from '@/components/domain/home/HomeProjectBrowse';
import { HomeRankedProjects } from '@/components/domain/home/HomeRankedProjects';
import { BROWSE_PROJECT_PAGE_SIZE } from '@/constants/project';
import { SITE_URL } from '@/constants/metadata';
import { projectKeys } from '@/lib/project/queryKeys';
import type { ProjectListParams } from '@/types/project';

const INITIAL_PROJECT_LIST_PARAMS = {
  sort: 'LATEST',
  page: 0,
  size: BROWSE_PROJECT_PAGE_SIZE,
} satisfies ProjectListParams;

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: projectKeys.list(INITIAL_PROJECT_LIST_PARAMS),
    queryFn: ({ signal }) =>
      getProjects(INITIAL_PROJECT_LIST_PARAMS, signal),
  });

  return (
    <div className="flex gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-10">
        <HomeBanner />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={null}>
            <HomeProjectBrowse />
          </Suspense>
        </HydrationBoundary>
      </div>
      <aside className="flex w-80 shrink-0 flex-col gap-14">
        <HomeRankedProjects />
      </aside>
    </div>
  );
}

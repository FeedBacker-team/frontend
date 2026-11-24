import type { Metadata } from 'next';

import { getProjects } from '@/apis/project';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { HomeBanner } from '@/components/domain/home/HomeBanner';
import { HomeProjectBrowse } from '@/components/domain/home/HomeProjectBrowse';
import { HomeRankedProjects } from '@/components/domain/home/HomeRankedProjects';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/constants/metadata';
import {
  BROWSE_PROJECT_PAGE_SIZE,
  RANKING_PROJECT_PAGE_SIZE,
} from '@/constants/project';
import type { ProjectListParams } from '@/types/project';

const INITIAL_PROJECT_LIST_PARAMS = {
  sort: 'LATEST',
  page: 0,
  size: BROWSE_PROJECT_PAGE_SIZE,
} satisfies ProjectListParams;

const POPULAR_PROJECT_LIST_PARAMS = {
  sort: 'VIEW_COUNT',
  page: 0,
  size: RANKING_PROJECT_PAGE_SIZE,
} satisfies ProjectListParams;

const WEB_TREND_PROJECT_LIST_PARAMS = {
  sort: 'VIEW_COUNT',
  tags: ['WEB'],
  page: 0,
  size: RANKING_PROJECT_PAGE_SIZE,
} satisfies ProjectListParams;

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export const dynamic = 'force-dynamic';

async function fetchOrUndefined(params: ProjectListParams) {
  try {
    return await getProjects(params);
  } catch {
    return undefined;
  }
}

const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Feedbacker',
      alternateName: '피드배커',
      url: SITE_URL,
      logo: `${SITE_URL}/images/Logo_symbol.svg`,
      description: SITE_DESCRIPTION,
      sameAs: [
        'https://www.instagram.com/feedbacker.team/',
        'https://www.threads.com/@feedbacker.team',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Feedbacker',
      alternateName: '피드배커',
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'ko-KR',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  ],
};

export default async function Home() {
  const [projects, popular, webTrend] = await Promise.all([
    fetchOrUndefined(INITIAL_PROJECT_LIST_PARAMS),
    fetchOrUndefined(POPULAR_PROJECT_LIST_PARAMS),
    fetchOrUndefined(WEB_TREND_PROJECT_LIST_PARAMS),
  ]);

  return (
    <>
      <JsonLd data={HOME_STRUCTURED_DATA} />
      <h1 className="sr-only">{SITE_TITLE}</h1>
      <div className="flex gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <HomeBanner />
          <HomeProjectBrowse initialProjects={projects} />
        </div>
        <aside className="flex w-80 shrink-0 flex-col gap-14">
          <HomeRankedProjects
            initialPopular={popular}
            initialWebTrend={webTrend}
          />
        </aside>
      </div>
      <ScrollToTopButton className="fixed right-10 bottom-30 z-50" />
    </>
  );
}
